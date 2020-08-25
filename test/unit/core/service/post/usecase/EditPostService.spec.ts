import { Test, TestingModule } from '@nestjs/testing';
import { PostRepositoryPort } from '../../../../../../src/core/domain/post/port/persistence/PostRepositoryPort';
import { PostDITokens } from '../../../../../../src/core/domain/post/di/PostDITokens';
import { EditPostService } from '../../../../../../src/core/service/post/usecase/EditPostService';
import { TypeOrmPostRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Post } from '../../../../../../src/core/domain/post/entity/Post';
import { v4 } from 'uuid';
import { PostUseCaseDto } from '../../../../../../src/core/domain/post/usecase/dto/PostUseCaseDto';
import { QueryBusPort } from '../../../../../../src/core/common/port/cqers/QueryBusPort';
import { CoreDITokens } from '../../../../../../src/core/common/di/CoreDITokens';
import { NestQueryBusAdapter } from '../../../../../../src/infrastructure/adapter/cqers/NestQueryBusAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { PostOwner } from '../../../../../../src/core/domain/post/entity/PostOwner';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';
import { PostImage } from '../../../../../../src/core/domain/post/entity/PostImage';
import { GetMediaPreviewQueryResult } from '../../../../../../src/core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { MediaType } from '../../../../../../src/core/common/enums/MediaEnums';
import { EditPostPort } from '../../../../../../src/core/domain/post/port/usecase/EditPostPort';
import { EditPostUseCase } from '../../../../../../src/core/domain/post/usecase/EditPostUseCase';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';

describe('EditPostService', () => {
  let editPostService: EditPostUseCase;
  let postRepository: PostRepositoryPort;
  let queryBus: QueryBusPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: PostDITokens.EditPostUseCase,
          useFactory: (postRepository, queryBus) => new EditPostService(postRepository, queryBus),
          inject: [PostDITokens.PostRepository, CoreDITokens.QueryBus]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        },
        {
          provide: CoreDITokens.QueryBus,
          useClass: NestQueryBusAdapter
        }
      ]
    }).compile();
  
    editPostService = module.get<EditPostUseCase>(PostDITokens.EditPostUseCase);
    postRepository  = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
    queryBus        = module.get<QueryBusPort>(CoreDITokens.QueryBus);
  });
  
  describe('execute', () => {
  
    test('Expect it edits post and updates record in repository', async () => {
      const mockPost: Post = await createPost();
      const mockPostImagePreview: GetMediaPreviewQueryResult = await createPostImagePreview();
  
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => mockPostImagePreview);
      jest.spyOn(postRepository, 'updatePost').mockImplementation(async () => undefined);
  
      jest.spyOn(postRepository, 'updatePost').mockClear();
  
      const editPostPort: EditPostPort = {
        executorId: mockPost.getOwner().getId(),
        postId    : mockPost.getId(),
        title     : v4(),
        imageId   : mockPostImagePreview.id,
      };
      
      const expectedPost: Post = await Post.new({
        id       : mockPost.getId(),
        owner    : mockPost.getOwner(),
        title    : editPostPort.title!,
        image    : await createPostImage(mockPostImagePreview.id, mockPostImagePreview.relativePath),
        createdAt: mockPost.getCreatedAt()
      });
  
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(expectedPost);
  
      const resultPostUseCaseDto: PostUseCaseDto = await editPostService.execute(editPostPort);
      const resultUpdatedPost: Post = jest.spyOn(postRepository, 'updatePost').mock.calls[0][0];
  
      expect(resultPostUseCaseDto.editedAt).toBeGreaterThanOrEqual(mockPost.getEditedAt()!.getTime());
  
      expect(resultPostUseCaseDto).toEqual({...expectedPostUseCaseDto, editedAt: resultPostUseCaseDto.editedAt});
      expect(resultUpdatedPost).toEqual({...expectedPost, editedAt: resultUpdatedPost.getEditedAt()});
    });
  
    test('When post not found, expect it throws Exception', async () => {
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => undefined);
    
      expect.hasAssertions();
    
      try {
        const editPostPort: EditPostPort = {executorId: v4(), postId: v4(), title: v4()};
        await editPostService.execute(editPostPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Post not found.');
      }
    });
  
    test('When image not found, expect it throws Exception', async () => {
      const mockPost: Post = await createPost();
      const mockPostImagePreview: GetMediaPreviewQueryResult = await createPostImagePreview();
  
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => undefined);
      
      expect.hasAssertions();
    
      try {
        const editPostPort: EditPostPort = {executorId: mockPost.getOwner().getId(), postId: v4(), imageId: mockPostImagePreview.id};
        await editPostService.execute(editPostPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Post image not found.');
      }
    });
  
    test('When user try to update other people\'s post, expect it throws Exception', async () => {
      const mockPost: Post = await createPost();
      const executorId: string = v4();
    
      jest.spyOn(postRepository, 'findPost').mockImplementation(async () => mockPost);
    
      expect.hasAssertions();
    
      try {
        const editPostPort: EditPostPort = {executorId: executorId, postId: mockPost.getId()};
        await editPostService.execute(editPostPort);
      
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

async function createPostImage(customId?: string, customRelativePath?: string): Promise<PostImage> {
  const id: string = customId || v4();
  const relativePath: string = customRelativePath || '/relative/path';
  
  return PostImage.new(id, relativePath);
}

function createPostImagePreview(): GetMediaPreviewQueryResult {
  const id: string = v4();
  const relativePath: string = '/relative/path';
  
  return GetMediaPreviewQueryResult.new(id, MediaType.IMAGE, relativePath);
}
