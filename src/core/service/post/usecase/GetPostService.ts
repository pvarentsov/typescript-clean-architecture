import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { GetPostUseCase } from '../../../domain/post/usecase/GetPostUseCase';
import { GetPostPort } from '../../../domain/post/port/usecase/GetPostPort';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';
import { PostStatus } from '../../../common/enums/PostEnums';

export class GetPostService implements GetPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostPort): Promise<PostUseCaseDto> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean =
      post.getStatus() === PostStatus.PUBLISHED
      || (payload.executorId === post.getOwner().getId() && post.getStatus() === PostStatus.DRAFT);
    
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
