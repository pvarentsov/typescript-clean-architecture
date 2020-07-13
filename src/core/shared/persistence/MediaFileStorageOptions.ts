import { MediaType } from '../../domain/media/entity/enum/MediaEnums';

export type MediaFileStorageOptions = {
  type: MediaType,
  public?: boolean,
};
