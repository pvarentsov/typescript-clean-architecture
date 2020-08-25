import { Test, TestingModule } from '@nestjs/testing';
import { GetPostUseCase } from '../../../../../../src/core/domain/post/usecase/GetPostUseCase';
import { PostRepositoryPort } from '../../../../../../src/core/domain/post/port/persistence/PostRepositoryPort';
import { PostDITokens } from '../../../../../../src/core/domain/post/di/PostDITokens';
import { GetPostService } from '../../../../../../src/core/service/post/usecase/GetPostService';
import { TypeOrmPostRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Post } from '../../../../../../src/core/domain/post/entity/Post';
import { v4 } from 'uuid';
import { PostStatus } from '../../../../../../src/core/common/enums/PostEnums';
import { GetPostPort } from '../../../../../../src/core/domain/post/port/usecase/GetPostPort';
import { PostUseCaseDto } from '../../../../../../src/core/domain/post/usecase/dto/PostUseCaseDto';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';
import { PostOwner } from '../../../../../../src/core/domain/post/entity/PostOwner';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';

describe('GetPostService', () => {
  let getPostService: GetPostUseCase;
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PostDITokens.GetPostUseCase,
          useFactory: (postRepository) => new GetPostService(postRepository),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        }
      ]
    }).compile();
  
    getPostService = module.get<GetPostUseCase>(PostDITokens.GetPostUseCase);
    postRepository = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
  });
  
  describe('execute', () => {
  
    test('When user try to get own draft post, expect it returns post', async () => {
      const mockPost: Post = await createPost(PostStatus.DRAFT);
      
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
      
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(mockPost);
  
      const getPostPort: GetPostPort = {executorId: mockPost.getOwner().getId(), postId: mockPost.getId()};
      const resultPostUseCaseDto: PostUseCaseDto = await getPostService.execute(getPostPort);
      
      expect(resultPostUseCaseDto).toEqual(expectedPostUseCaseDto);
    });
  
    test('When user try to get own published post, expect it returns post', async () => {
      const mockPost: Post = await createPost(PostStatus.PUBLISHED);
    
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(mockPost);
    
      const getPostPort: GetPostPort = {executorId: mockPost.getOwner().getId(), postId: mockPost.getId()};
      const resultPostUseCaseDto: PostUseCaseDto = await getPostService.execute(getPostPort);
    
      expect(resultPostUseCaseDto).toEqual(expectedPostUseCaseDto);
    });
  
    test('When post not found, expect it throws Exception', async () => {
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const getPostPort: GetPostPort = {executorId: v4(), postId: v4()};
        await getPostService.execute(getPostPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to get other people\'s published post, expect it returns post', async () => {
      const mockPost: Post = await createPost(PostStatus.PUBLISHED);
    
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(mockPost);
    
      const getPostPort: GetPostPort = {executorId: v4(), postId: mockPost.getId()};
      const resultPostUseCaseDto: PostUseCaseDto = await getPostService.execute(getPostPort);
    
      expect(resultPostUseCaseDto).toEqual(expectedPostUseCaseDto);
    });
  
    test('When user try to get other people\'s draft post, expect it throws Exception', async () => {
      const mockPost: Post = await createPost(PostStatus.DRAFT);

      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      expect.hasAssertions();
    
      try {
        const getPostPort: GetPostPort = {executorId: v4(), postId: v4()};
        await getPostService.execute(getPostPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
    
  });
  
});

async function createPost(staus: PostStatus): Promise<Post> {
  return Post.new({
    owner : await PostOwner.new(v4(), v4(), UserRole.AUTHOR),
    title : 'Post title',
    status: staus
  });
}
