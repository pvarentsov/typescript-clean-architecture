import { CreatePostUseCase } from '../../../domain/post/usecase/CreatePostUseCase';
import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { CreatePostPort } from '../../../domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { QueryBusPort } from '../../../common/port/cqers/QueryBusPort';
import { GetMediaPreviewQueryResult } from '../../../common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { Optional } from '../../../common/type/CommonTypes';
import { GetMediaPreviewQuery } from '../../../common/cqers/query/queries/media/GetMediaPreviewQuery';
import { GetUserPreviewQueryResult } from '../../../common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { GetUserPreviewQuery } from '../../../common/cqers/query/queries/user/GetUserPreviewQuery';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { PostOwner } from '../../../domain/post/entity/PostOwner';
import { PostImage } from '../../../domain/post/entity/PostImage';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

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
