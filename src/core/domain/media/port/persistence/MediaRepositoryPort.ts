import { Nullable, Optional } from '../../../../shared/type/CommonTypes';
import { RepositoryFindOptions, RepositoryRemoveOptions, RepositoryUpdateManyOptions } from '../../../../shared/persistence/RepositoryOptions';
import { Media } from '../../entity/Media';

export interface MediaRepositoryPort {

  findMedia(by: {id?: string}, options?: RepositoryFindOptions): Promise<Optional<Media>>;
  
  findManyMedias(by: {ownerId?: string}, options?: RepositoryFindOptions): Promise<Media[]>;
  
  addMedia(post: Media): Promise<{id: string}>;
  
  updateMedia(post: Media): Promise<void>;
  
  updateManyMedias(values: {imageId?: Nullable<string>}, by: {imageId?: string}, options?: RepositoryUpdateManyOptions): Promise<void>;
  
  removeMedia(post: Media, options?: RepositoryRemoveOptions): Promise<void>;
  
  removeManyMedias(by: {authorId?: string}, options?: RepositoryRemoveOptions): Promise<void>;

}
