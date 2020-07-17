import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { Post } from '../../../domain/post/entity/Post';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { RemovePostUseCase } from '../../../domain/post/usecase/RemovePostUseCase';
import { RemovePostPort } from '../../../domain/post/port/usecase/RemovePostPort';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

export class RemovePostService implements RemovePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: RemovePostPort): Promise<void> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === post.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await this.postRepository.removePost(post);
  }
  
}
