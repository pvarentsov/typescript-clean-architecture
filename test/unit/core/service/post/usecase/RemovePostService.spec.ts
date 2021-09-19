import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { RemovePostPort } from '@core/domain/post/port/usecase/RemovePostPort';
import { RemovePostUseCase } from '@core/domain/post/usecase/RemovePostUseCase';
import { RemovePostService } from '@core/service/post/usecase/RemovePostService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('RemovePostService', () => {
  let removePostService: RemovePostUseCase;
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: PostDITokens.RemovePostUseCase,
          useFactory: (postRepository) => new RemovePostService(postRepository),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        },
      ]
    }).compile();
  
    removePostService = module.get<RemovePostUseCase>(PostDITokens.RemovePostUseCase);
    postRepository    = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it removes post', async () => {
      const mockPost: Post = await createPost();
      
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
      jest.spyOn(postRepository, 'removePost').mockImplementation(async () => undefined);
      
      jest.spyOn(postRepository, 'removePost').mockClear();
  
      const removePostPort: RemovePostPort = {executorId: mockPost.getOwner().getId(), postId: mockPost.getId()};
      await removePostService.execute(removePostPort);
      
      const removedPost: Post = jest.spyOn(postRepository, 'removePost').mock.calls[0][0];
      
      expect(removedPost).toEqual(mockPost);
    });
  
    test('When post not found, expect it throws Exception', async () => {
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const removePostPort: RemovePostPort = {executorId: v4(), postId: v4()};
        await removePostService.execute(removePostPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to remove other people\'s post, expect it throws Exception', async () => {
      const mockPost: Post = await createPost();
      const executorId: string = v4();
    
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      expect.hasAssertions();
    
      try {
        const removePostPort: RemovePostPort = {executorId: executorId, postId: mockPost.getId()};
        await removePostService.execute(removePostPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
    
  });
  
});

async function createPost(): Promise<Post> {
  return Post.new({
    owner: await PostOwner.new(v4(), v4(), UserRole.AUTHOR),
    title: 'Post title',
  });
}
