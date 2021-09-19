import { Code } from '@core/common/code/Code';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { QueryBusPort } from '@core/common/port/message/QueryBusPort';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { EditPostUseCase } from '@core/domain/post/usecase/EditPostUseCase';
import { EditPostService } from '@core/service/post/usecase/EditPostService';
import { NestQueryBusAdapter } from '@infrastructure/adapter/message/NestQueryBusAdapter';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

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
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
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
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
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
