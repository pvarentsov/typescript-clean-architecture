import { CreatePostUseCase } from '../../domain/post/usecase/CreatePostUseCase';
import { PostRepositoryPort } from '../../domain/post/port/persistence/PostRepositoryPort';
import { CreatePostPort } from '../../domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../domain/post/entity/Post';

export class CreatePostService implements CreatePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: CreatePostPort): Promise<PostUseCaseDto> {
    const post: Post = await Post.new({
      authorId: payload.executorId,
      imageId: payload.imageId,
      content: payload.content,
    });
    
    await this.postRepository.addPost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
