import { PostStatus } from '../../../../common/enums/PostEnums';
import { Nullable } from '../../../../common/type/CommonTypes';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Post } from '../../entity/Post';

@Exclude()
export class PostUseCaseDto {

  @Expose()
  public id: string;
  
  @Expose()
  public ownerId: string;
  
  @Expose()
  public imageId: string;
  
  @Expose()
  public content: string;
  
  @Expose()
  public status: PostStatus;
  
  public createdAt: number;
  
  public editedAt: Nullable<number>;
  
  public publishedAt: Nullable<number>;
  
  public static newFromPost(post: Post): PostUseCaseDto {
    const dto: PostUseCaseDto =  plainToClass(PostUseCaseDto, post);
    
    dto.createdAt = post.getCreatedAt().getTime();
    dto.editedAt = post.getEditedAt()?.getTime() || null;
    dto.publishedAt = post.getPublishedAt()?.getTime() || null;
    
    return dto;
  }
  
  public static newListFromPosts(posts: Post[]): PostUseCaseDto[] {
    return posts.map(post => this.newFromPost(post));
  }
  
}
