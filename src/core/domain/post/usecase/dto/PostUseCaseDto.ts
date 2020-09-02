import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { Exclude, Expose, plainToClass } from 'class-transformer';

@Exclude()
export class PostUseCaseDto {

  @Expose()
  public id: string;
  
  public owner: { id: string, name: string, role: UserRole };
  
  public image: Nullable<{id: string, url: string}>;
  
  @Expose()
  public title: string;
  
  @Expose()
  public content: string;
  
  @Expose()
  public status: PostStatus;
  
  public createdAt: number;
  
  public editedAt: Nullable<number>;
  
  public publishedAt: Nullable<number>;
  
  public static newFromPost(post: Post): PostUseCaseDto {
    const dto: PostUseCaseDto =  plainToClass(PostUseCaseDto, post);
    const postOwner: PostOwner = post.getOwner();
    const postImage: Nullable<PostImage> = post.getImage();
    
    dto.owner = {id: postOwner.getId(), name: postOwner.getName(), role: postOwner.getRole()};
    dto.image = null;
    
    if (postImage) {
      dto.image = {id: postImage.getId(), url: postImage.getRelativePath()};
    }
    
    dto.createdAt = post.getCreatedAt().getTime();
    dto.editedAt = post.getEditedAt()?.getTime() || null;
    dto.publishedAt = post.getPublishedAt()?.getTime() || null;
    
    return dto;
  }
  
  public static newListFromPosts(posts: Post[]): PostUseCaseDto[] {
    return posts.map(post => this.newFromPost(post));
  }
  
}
