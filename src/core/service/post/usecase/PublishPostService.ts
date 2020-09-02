import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { PublishPostUseCase } from '@core/domain/post/usecase/PublishPostUseCase';

export class PublishPostService implements PublishPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: PublishPostPort): Promise<PostUseCaseDto> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === post.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await post.publish();
    await this.postRepository.updatePost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
