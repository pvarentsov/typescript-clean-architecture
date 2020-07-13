import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { Optional } from '../../../shared/type/CommonTypes';
import { Exception } from '../../../shared/exception/Exception';
import { Code } from '../../../shared/code/Code';
import { PublishPostUseCase } from '../../../domain/post/usecase/PublishPostUseCase';
import { PublishPostPort } from '../../../domain/post/port/usecase/PublishPostPort';

export class PublishPostService implements PublishPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: PublishPostPort): Promise<PostUseCaseDto> {
    const post: Optional<Post> = await this.postRepository.findPost({id: payload.postId});
    if (!post) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'});
    }
    
    await post.publish();
    await this.postRepository.updatePost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
