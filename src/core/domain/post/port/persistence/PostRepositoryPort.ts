import { PostStatus } from '@core/common/enums/PostEnums';
import { RepositoryFindOptions, RepositoryRemoveOptions, RepositoryUpdateManyOptions } from '@core/common/persistence/RepositoryOptions';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { Post } from '@core/domain/post/entity/Post';

export interface PostRepositoryPort {

  findPost(by: {id?: string}, options?: RepositoryFindOptions): Promise<Optional<Post>>;
  
  findPosts(by: {ownerId?: string, status?: PostStatus}, options?: RepositoryFindOptions): Promise<Post[]>;
  
  addPost(post: Post): Promise<{id: string}>;
  
  updatePost(post: Post): Promise<void>;
  
  updatePosts(values: {imageId?: Nullable<string>}, by: {imageId?: string}, options?: RepositoryUpdateManyOptions): Promise<void>;
  
  removePost(post: Post, options?: RepositoryRemoveOptions): Promise<void>;

}
