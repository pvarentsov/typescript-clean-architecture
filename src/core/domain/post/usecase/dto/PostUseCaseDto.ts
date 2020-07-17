import { PostStatus } from '../../../../common/enums/PostEnums';
import { Nullable } from '../../../../common/type/CommonTypes';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Post } from '../../entity/Post';
import { PostOwner } from '../../entity/PostOwner';
import { resolve } from 'url';
import { PostImage } from '../../entity/PostImage';
import { UserRole } from '../../../../common/enums/UserEnums';

@Exclude()
export class PostUseCaseDto {

  @Expose()
  public id: string;
  
  public owner: { id: string, name: string, role: UserRole };
  
  public image: Nullable<{id: string, url: string}>;
  
  @Expose()
  public content: string;
  
  @Expose()
  public status: PostStatus;
  
  public createdAt: number;
  
  public editedAt: Nullable<number>;
  
  public publishedAt: Nullable<number>;
  
  public static newFromPost(post: Post, options?: {storageBasePath?: string}): PostUseCaseDto {
    const dto: PostUseCaseDto =  plainToClass(PostUseCaseDto, post);
    const postOwner: PostOwner = post.getOwner();
    const postImage: Nullable<PostImage> = post.getImage();
    
    dto.owner = {id: postOwner.getId(), name: postOwner.getName(), role: postOwner.getRole()};
    dto.image = null;
    
    if (postImage) {
      dto.image = {id: postImage.getId(), url: this.buildImageUrl(postImage, options)};
    }
    
    dto.createdAt = post.getCreatedAt().getTime();
    dto.editedAt = post.getEditedAt()?.getTime() || null;
    dto.publishedAt = post.getPublishedAt()?.getTime() || null;
    
    return dto;
  }
  
  public static newListFromPosts(posts: Post[], options?: {storageBasePath?: string}): PostUseCaseDto[] {
    return posts.map(post => this.newFromPost(post, options));
  }
  
  private static buildImageUrl(postImage: PostImage, options?: {storageBasePath?: string}): string {
    return options?.storageBasePath
      ? resolve(options?.storageBasePath, postImage.getRelativePath())
      : postImage.getRelativePath();
  }
  
}
