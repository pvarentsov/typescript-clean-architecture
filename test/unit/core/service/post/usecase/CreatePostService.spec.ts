import { Code } from '@core/common/code/Code';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { GetUserPreviewQueryResult } from '@core/common/message/query/queries/user/result/GetUserPreviewQueryResult';
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
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';
import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { CreatePostService } from '@core/service/post/usecase/CreatePostService';
import { NestQueryBusAdapter } from '@infrastructure/adapter/message/NestQueryBusAdapter';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('CreatePostService', () => {
  let createPostService: CreatePostUseCase;
  let postRepository: PostRepositoryPort;
  let queryBus: QueryBusPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: PostDITokens.CreatePostUseCase,
          useFactory: (postRepository, queryBus) => new CreatePostService(postRepository, queryBus),
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
  
    createPostService = module.get<CreatePostUseCase>(PostDITokens.CreatePostUseCase);
    postRepository    = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
    queryBus          = module.get<QueryBusPort>(CoreDITokens.QueryBus);
  });
  
  describe('execute', () => {
  
    test('Expect it creates post', async () => {
      const mockPostId: string = v4();
      
      const mockPostOwnerPreview: GetUserPreviewQueryResult = await createPostOwnerPreview();
      const mockPostImagePreview: GetMediaPreviewQueryResult = await createPostImagePreview();
      
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => mockPostOwnerPreview);
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => mockPostImagePreview);
      jest.spyOn(postRepository, 'addPost').mockImplementation(async () => {
        return {id: mockPostId};
      });
  
      jest.spyOn(postRepository, 'addPost').mockClear();
  
      const createPostPort: CreatePostPort = {
        executorId: v4(),
        title     : v4(),
        imageId   : mockPostImagePreview.id,
      };
      
      const expectedPost: Post = await Post.new({
        id   : mockPostId,
        owner: await createPostOwner(mockPostOwnerPreview.id, mockPostOwnerPreview.name),
        title: createPostPort.title,
        image: await createPostImage(mockPostImagePreview.id, mockPostImagePreview.relativePath),
      });
  
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(expectedPost);
      
      const resultPostUseCaseDto: PostUseCaseDto = await createPostService.execute(createPostPort);
      Reflect.set(resultPostUseCaseDto, 'id', expectedPostUseCaseDto.id);
      Reflect.set(resultPostUseCaseDto, 'createdAt', expectedPostUseCaseDto.createdAt);
      
      const resultAddedPost: Post = jest.spyOn(postRepository, 'addPost').mock.calls[0][0];
      Reflect.set(resultAddedPost, 'id', expectedPost.getId());
      Reflect.set(resultAddedPost, 'createdAt', expectedPost.getCreatedAt());
      
      expect(resultPostUseCaseDto).toEqual(expectedPostUseCaseDto);
      expect(resultAddedPost).toEqual(expectedPost);
    });
  
    test('When owner not found, expect it throws Exception', async () => {
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => undefined);
    
      expect.hasAssertions();
  
      try {
        const createPostPort: CreatePostPort = {executorId: v4(), title: v4()};
        await createPostService.execute(createPostPort);
    
      } catch (e) {
    
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
    
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Post owner not found.');
      }
    });
  
    test('When image not found, expect it throws Exception', async () => {
      const mockPostOwnerPreview: GetUserPreviewQueryResult = await createPostOwnerPreview();
  
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => mockPostOwnerPreview);
      jest.spyOn(queryBus, 'sendQuery').mockImplementationOnce(async () => undefined);
    
      expect.hasAssertions();
    
      try {
        const createPostPort: CreatePostPort = {executorId: v4(), title: v4(), imageId: v4()};
        await createPostService.execute(createPostPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Post image not found.');
      }
    });
    
  });
  
});

async function createPostOwner(customId?: string, customName?: string): Promise<PostOwner> {
  const id: string = customId || v4();
  const name: string = customName || v4();
  const role: UserRole = UserRole.AUTHOR;
  
  return PostOwner.new(id, name, role);
}

function createPostOwnerPreview(): GetUserPreviewQueryResult {
  const id: string = v4();
  const name: string = v4();
  const role: UserRole = UserRole.AUTHOR;
  
  return GetUserPreviewQueryResult.new(id, name, role);
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
