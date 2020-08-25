import { Test, TestingModule } from '@nestjs/testing';
import { RemovePostUseCase } from '../../../../../../src/core/domain/post/usecase/RemovePostUseCase';
import { PostRepositoryPort } from '../../../../../../src/core/domain/post/port/persistence/PostRepositoryPort';
import { PostDITokens } from '../../../../../../src/core/domain/post/di/PostDITokens';
import { RemovePostService } from '../../../../../../src/core/service/post/usecase/RemovePostService';
import { TypeOrmPostRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Post } from '../../../../../../src/core/domain/post/entity/Post';
import { v4 } from 'uuid';
import { RemovePostPort } from '../../../../../../src/core/domain/post/port/usecase/RemovePostPort';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';
import { CqrsModule } from '@nestjs/cqrs';
import { PostOwner } from '../../../../../../src/core/domain/post/entity/PostOwner';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';

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
  
        const exception: Exception<ClassValidationDetails> = e;
  
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
      
        const exception: Exception<ClassValidationDetails> = e;
      
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
