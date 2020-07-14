import { Nullable, Optional } from '../../../../common/type/CommonTypes';
import { RepositoryFindOptions, RepositoryRemoveOptions, RepositoryUpdateManyOptions } from '../../../../common/persistence/RepositoryOptions';
import { Media } from '../../entity/Media';

export interface MediaRepositoryPort {

  findMedia(by: {id?: string}, options?: RepositoryFindOptions): Promise<Optional<Media>>;
  
  findMedias(by: {ownerId?: string}, options?: RepositoryFindOptions): Promise<Media[]>;
  
  countMedia(by: {id?: string, ownerId?: string}, options?: RepositoryFindOptions): Promise<number>;
  
  addMedia(media: Media): Promise<{id: string}>;
  
  updateMedia(media: Media): Promise<void>;
  
  updateMedias(values: {imageId?: Nullable<string>}, by: {imageId?: string}, options?: RepositoryUpdateManyOptions): Promise<void>;
  
  removeMedia(media: Media, options?: RepositoryRemoveOptions): Promise<void>;
  
  removeMedias(by: {ownerId?: string}, options?: RepositoryRemoveOptions): Promise<void>;

}
