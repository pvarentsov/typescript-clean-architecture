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

export class EditPostService implements EditPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: EditPostPort): Promise<PostUseCaseDto> {
    const post: Optional<Post> = await this.postRepository.findPost({id: payload.postId});
    if (!post) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'});
    }
    
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
      const postImage: Optional<GetMediaPreviewQueryResult> = await this.queryBus.sendQuery(
        GetMediaPreviewQuery.new({id: payload.imageId, ownerId: payload.executorId})
      );
      if (!postImage) {
        throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'});
      }
      newPostImage = await PostImage.new(postImage.id, postImage.relativePath);
    }
    if (needResetImage) {
      newPostImage = null;
    }
    
    return newPostImage;
  }
  
}
