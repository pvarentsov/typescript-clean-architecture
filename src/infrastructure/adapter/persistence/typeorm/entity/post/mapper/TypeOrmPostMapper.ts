import { PostStatus } from '@core/common/enums/PostEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { TypeOrmPost } from '@infrastructure/adapter/persistence/typeorm/entity/post/TypeOrmPost';

export class TypeOrmPostMapper {
  
  public static toOrmEntity(domainPost: Post): TypeOrmPost {
    const ormPost: TypeOrmPost = new TypeOrmPost();
    const image: Nullable<PostImage> = domainPost.getImage();
    
    ormPost.id          = domainPost.getId();
    ormPost.ownerId     = domainPost.getOwner().getId();
    ormPost.title       = domainPost.getTitle();
    
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ormPost.imageId     = image ? image.getId() : null!;
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
  
  public static toDomainEntity(ormPost: TypeOrmPost): Post {
    const domainPost: Post = new Post({
      owner      : new PostOwner(ormPost.owner.id, `${ormPost.owner.firstName} ${ormPost.owner.lastName}`, ormPost.owner.role),
      title      : ormPost.title,
      image      : ormPost.image ? new PostImage(ormPost.image.id, ormPost.image.relativePath) : null,
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
  
  public static toDomainEntities(ormPosts: TypeOrmPost[]): Post[] {
    return ormPosts.map(ormPost => this.toDomainEntity(ormPost));
  }
  
}
