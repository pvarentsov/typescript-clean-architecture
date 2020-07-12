import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { Post } from '../../../domain/post/entity/Post';
import { Optional } from '../../../shared/type/CommonTypes';
import { Exception } from '../../../shared/exception/Exception';
import { Code } from '../../../shared/code/Code';
import { RemovePostUseCase } from '../../../domain/post/usecase/RemovePostUseCase';
import { RemovePostPort } from '../../../domain/post/port/usecase/RemovePostPort';

export class RemovePostService implements RemovePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: RemovePostPort): Promise<void> {
    const post: Optional<Post> = await this.postRepository.findPost({id: payload.postId});
    if (!post) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    }
    
    await this.postRepository.removePost(post);
  }
  
}
