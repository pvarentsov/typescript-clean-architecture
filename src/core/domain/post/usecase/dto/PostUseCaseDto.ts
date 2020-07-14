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
  
  @Expose()
  public createdAt: Date;
  
  @Expose()
  public editedAt: Nullable<Date>;
  
  @Expose()
  public publishedAt: Nullable<Date>;
  
  public static newFromPost(post: Post): PostUseCaseDto {
    return plainToClass(PostUseCaseDto, post);
  }
  
  public static newListFromPosts(posts: Post[]): PostUseCaseDto[] {
    return posts.map(post => this.newFromPost(post));
  }
  
}
