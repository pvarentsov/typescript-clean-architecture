import { Test, TestingModule } from '@nestjs/testing';
import { PostRepositoryPort } from '../../../../../../src/core/domain/post/port/persistence/PostRepositoryPort';
import { PostDITokens } from '../../../../../../src/core/domain/post/di/PostDITokens';
import { CreatePostService } from '../../../../../../src/core/service/post/usecase/CreatePostService';
import { TypeOrmPostRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Post } from '../../../../../../src/core/domain/post/entity/Post';
import { v4 } from 'uuid';
import { CreatePostPort } from '../../../../../../src/core/domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '../../../../../../src/core/domain/post/usecase/dto/PostUseCaseDto';
import { QueryBusPort } from '../../../../../../src/core/common/port/cqers/QueryBusPort';
import { CoreDITokens } from '../../../../../../src/core/common/di/CoreDITokens';
import { NestQueryBusAdapter } from '../../../../../../src/infrastructure/adapter/cqers/NestQueryBusAdapter';
import { CqrsModule } from '@nestjs/cqrs';
import { PostOwner } from '../../../../../../src/core/domain/post/entity/PostOwner';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';
import { GetUserPreviewQueryResult } from '../../../../../../src/core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { PostImage } from '../../../../../../src/core/domain/post/entity/PostImage';
import { GetMediaPreviewQueryResult } from '../../../../../../src/core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { MediaType } from '../../../../../../src/core/common/enums/MediaEnums';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';
import { CreatePostUseCase } from '../../../../../../src/core/domain/post/usecase/CreatePostUseCase';

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
    
        const exception: Exception<ClassValidationDetails> = e;
    
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
      
        const exception: Exception<ClassValidationDetails> = e;
      
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
