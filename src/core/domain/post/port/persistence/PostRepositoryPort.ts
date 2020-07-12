import { Nullable, Optional } from '../../../../shared/type/CommonTypes';
import { Post } from '../../entity/Post';
import { RepositoryFindOptions, RepositoryRemoveOptions, RepositoryUpdateManyOptions } from '../../../../shared/persistence/RepositoryOptions';

export interface PostRepositoryPort {

  findPost(by: {id?: string}, options?: RepositoryFindOptions): Promise<Optional<Post>>;
  
  findManyPosts(by: {authorId?: string}, options?: RepositoryFindOptions): Promise<Post[]>;
  
  addPost(post: Post): Promise<{id: string}>;
  
  updatePost(post: Post): Promise<void>;
  
  updateManyPosts(values: {imageId?: Nullable<string>}, by: {imageId?: string}, options?: RepositoryUpdateManyOptions): Promise<void>;
  
  removePost(post: Post, options?: RepositoryRemoveOptions): Promise<void>;
  
  removeManyPosts(by: {authorId?: string}, options?: RepositoryRemoveOptions): Promise<void>;

}
