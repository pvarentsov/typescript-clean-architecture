import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';
import { PublishPostUseCase } from '@core/domain/post/usecase/PublishPostUseCase';
import { PublishPostService } from '@core/service/post/usecase/PublishPostService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('PublishPostService', () => {
  let publishPostService: PublishPostUseCase;
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: PostDITokens.PublishPostUseCase,
          useFactory: (postRepository) => new PublishPostService(postRepository),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        },
      ]
    }).compile();
  
    publishPostService = module.get<PublishPostUseCase>(PostDITokens.PublishPostUseCase);
    postRepository     = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it publishes post', async () => {
      const currentDate: number = Date.now();
      
      const mockPost: Post = await createPost();
      
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
      jest.spyOn(postRepository, 'updatePost').mockImplementation(async () => undefined);
      
      jest.spyOn(postRepository, 'updatePost').mockClear();
  
      const publishPostPort: PublishPostPort = {executorId: mockPost.getOwner().getId(), postId: mockPost.getId()};
      await publishPostService.execute(publishPostPort);
      
      const publishedPost: Post = jest.spyOn(postRepository, 'updatePost').mock.calls[0][0];
  
      expect(publishedPost.getPublishedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(publishedPost).toEqual(mockPost);
    });
  
    test('When post not found, expect it throws Exception', async () => {
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const publishPostPort: PublishPostPort = {executorId: v4(), postId: v4()};
        await publishPostService.execute(publishPostPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to publish other people\'s post, expect it throws Exception', async () => {
      const mockPost: Post = await createPost();
      const executorId: string = v4();
    
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      expect.hasAssertions();
    
      try {
        const publishPostPort: PublishPostPort = {executorId: executorId, postId: mockPost.getId()};
        await publishPostService.execute(publishPostPort);
      
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
