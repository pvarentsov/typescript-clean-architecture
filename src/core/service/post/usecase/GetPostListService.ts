import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostListUseCase } from '@core/domain/post/usecase/GetPostListUseCase';

export class GetPostListService implements GetPostListUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostListPort): Promise<PostUseCaseDto[]> {
    const posts: Post[] = await this.postRepository.findPosts({
      ownerId: payload.ownerId,
      status: payload.status,
    });
    
    return PostUseCaseDto.newListFromPosts(posts);
  }
  
}
