import { Optional } from '../../../.shared/type/CommonTypes';
import { Post } from '../../entity/Post';

export interface PostRepositoryPort {

  findOne(by: {id?: string}): Promise<Optional<Post>>;
  
  findMany(by: {authorId?: string}): Promise<Post[]>;
  
  addOne(post: Post): Promise<{id: string}>;
  
  addMany(posts: Post[]): Promise<{ids: string[]}>;

}
