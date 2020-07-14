import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { GetPostListUseCase } from '../../../domain/post/usecase/GetPostListUseCase';
import { GetPostListPort } from '../../../domain/post/port/usecase/GetPostListPort';

export class GetPostListService implements GetPostListUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostListPort): Promise<PostUseCaseDto[]> {
    const posts: Post[] = await this.postRepository.findPosts({ownerId: payload.ownerId});
    return PostUseCaseDto.newListFromPosts(posts);
  }
  
}
