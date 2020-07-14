import { Post } from '../../../../../../../core/domain/post/entity/Post';
import { TypeOrmPost } from '../TypeOrmPost';
import { PostStatus } from '../../../../../../../core/common/enums/PostEnums';

export class TypeOrmPostMapper {
  
  public static toOrmEntity(domainPost: Post): TypeOrmPost {
    const ormPost: TypeOrmPost = new TypeOrmPost();
    
    ormPost.id          = domainPost.getId();
    ormPost.ownerId     = domainPost.getOwnerId();
    ormPost.title       = domainPost.getTitle();
    ormPost.imageId     = domainPost.getImageId() as string;
    ormPost.content     = domainPost.getContent() as string;
    ormPost.status      = domainPost.getStatus() as PostStatus;
    
    ormPost.createdAt   = domainPost.getCreatedAt();
    ormPost.editedAt    = domainPost.getEditedAt() as Date;
    ormPost.publishedAt = domainPost.getPublishedAt() as Date;
    ormPost.removedAt   = domainPost.getRemovedAt() as Date;
    
    return ormPost;
  }
  
  public static toOrmEntities(domainPosts: Post[]): TypeOrmPost[] {
    return domainPosts.map(domainPost => this.toOrmEntity(domainPost));
  }
  
  public static async toDomainEntity(ormPost: TypeOrmPost): Promise<Post> {
    const domainPost: Post = await Post.new({
      ownerId    : ormPost.ownerId,
      title      : ormPost.title,
      imageId    : ormPost.imageId,
      content    : ormPost.content,
      id         : ormPost.id,
      status     : ormPost.status,
      createdAt  : ormPost.createdAt,
      editedAt   : ormPost.editedAt,
      publishedAt: ormPost.publishedAt,
      removedAt  : ormPost.removedAt,
    });
    
    return domainPost;
  }
  
  public static async toDomainEntities(ormPosts: TypeOrmPost[]): Promise<Post[]> {
    return Promise.all(ormPosts.map(async ormPost => this.toDomainEntity(ormPost)));
  }
  
}
