import { UserRole } from '@core/common/enums/UserEnums';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostListUseCase } from '@core/domain/post/usecase/GetPostListUseCase';
import { GetPostListService } from '@core/service/post/usecase/GetPostListService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('GetPostListService', () => {
  let getPostListService: GetPostListUseCase;
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PostDITokens.GetPostListUseCase,
          useFactory: (postRepository) => new GetPostListService(postRepository),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        }
      ]
    }).compile();
  
    getPostListService = module.get<GetPostListUseCase>(PostDITokens.GetPostListUseCase);
    postRepository = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it returns post list', async () => {
      const mockPost: Post = await createPost();
      
      jest.spyOn(postRepository, 'findPosts').mockImplementation(async () => [mockPost]);
      
      const expectedPostUseCaseDto: PostUseCaseDto = await PostUseCaseDto.newFromPost(mockPost);
  
      const getPostListPort: GetPostListPort = {executorId: mockPost.getOwner().getId()};
      const resultPostUseCaseDtos: PostUseCaseDto[] = await getPostListService.execute(getPostListPort);
  
      expect(resultPostUseCaseDtos.length).toBe(1);
      expect(resultPostUseCaseDtos[0]).toEqual(expectedPostUseCaseDto);
    });
    
  });
  
});

async function createPost(): Promise<Post> {
  return Post.new({
    owner : await PostOwner.new(v4(), v4(), UserRole.AUTHOR),
    title : 'Post title',
  });
}
