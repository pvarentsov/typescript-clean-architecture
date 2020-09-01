import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { QueryBusPort } from '@core/common/port/cqers/QueryBusPort';
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetUserPreviewQueryResult } from '@core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { GetUserPreviewQuery } from '@core/common/cqers/query/queries/user/GetUserPreviewQuery';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { Optional } from '@core/common/type/CommonTypes';
import { GetMediaPreviewQueryResult } from '@core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { GetMediaPreviewQuery } from '@core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { Post } from '@core/domain/post/entity/Post';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostImage } from '@core/domain/post/entity/PostImage';

export class CreatePostService implements CreatePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: CreatePostPort): Promise<PostUseCaseDto> {
    const postOwner: GetUserPreviewQueryResult = CoreAssert.notEmpty(
      await this.queryBus.sendQuery(GetUserPreviewQuery.new({id: payload.executorId})),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post owner not found.'})
    );
    
    const postImage: Optional<GetMediaPreviewQueryResult> = payload.imageId
      ? await this.queryBus.sendQuery(GetMediaPreviewQuery.new({id: payload.imageId, ownerId: payload.executorId}))
      : undefined;
    
    const imageNotFound: boolean = !! (!postImage && payload.imageId);
    CoreAssert.isFalse(imageNotFound, Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'}));
    
    const post: Post = await Post.new({
      owner  : await PostOwner.new(postOwner.id, postOwner.name, postOwner.role),
      image  : postImage ? await PostImage.new(postImage.id, postImage.relativePath) : null,
      title  : payload.title,
      content: payload.content,
    });
    
    await this.postRepository.addPost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
