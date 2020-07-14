import { Optional } from '../../../../common/type/CommonTypes';
import { RepositoryFindOptions, RepositoryRemoveOptions } from '../../../../common/persistence/RepositoryOptions';
import { Media } from '../../entity/Media';

export interface MediaRepositoryPort {

  findMedia(by: {id?: string}, options?: RepositoryFindOptions): Promise<Optional<Media>>;
  
  findMedias(by: {ownerId?: string}, options?: RepositoryFindOptions): Promise<Media[]>;
  
  countMedias(by: {id?: string, ownerId?: string}, options?: RepositoryFindOptions): Promise<number>;
  
  addMedia(media: Media): Promise<{id: string}>;
  
  updateMedia(media: Media): Promise<void>;
  
  removeMedia(media: Media, options?: RepositoryRemoveOptions): Promise<void>;

}
