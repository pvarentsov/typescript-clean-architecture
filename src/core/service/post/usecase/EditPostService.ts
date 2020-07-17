import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { EditPostUseCase } from '../../../domain/post/usecase/EditPostUseCase';
import { EditPostPort } from '../../../domain/post/port/usecase/EditPostPort';
import { Nullable, Optional } from '../../../common/type/CommonTypes';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { QueryBusPort } from '../../../common/port/cqers/QueryBusPort';
import { GetMediaPreviewQueryResult } from '../../../common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { GetMediaPreviewQuery } from '../../../common/cqers/query/queries/media/GetMediaPreviewQuery';
import { PostImage } from '../../../domain/post/entity/PostImage';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

export class EditPostService implements EditPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: EditPostPort): Promise<PostUseCaseDto> {
    const post: Post = CoreAssert.notEmpty(
      await this.postRepository.findPost({id: payload.postId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === post.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await post.edit({
      title: payload.title,
      image: await this.defineNewImage(payload, post),
      content: payload.content
    });
    
    await this.postRepository.updatePost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
  /** ¯\_(ツ)_/¯ **/
  private async defineNewImage(payload: EditPostPort, post: Post): Promise<Optional<Nullable<PostImage>>> {
    let newPostImage: Optional<Nullable<PostImage>>;
    
    const needUpdateImage: boolean = !! (payload.imageId && payload.imageId !== post.getImage()?.getId());
    const needResetImage: boolean = payload.imageId === null;
    
    if (needUpdateImage) {
      const query: GetMediaPreviewQuery = GetMediaPreviewQuery.new({id: payload.imageId, ownerId: payload.executorId});
      const exception: Exception<void> = Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'});
      const postImage: GetMediaPreviewQueryResult = CoreAssert.notEmpty(await this.queryBus.sendQuery(query), exception);

      newPostImage = await PostImage.new(postImage.id, postImage.relativePath);
    }
    if (needResetImage) {
      newPostImage = null;
    }
    
    return newPostImage;
  }
  
}
