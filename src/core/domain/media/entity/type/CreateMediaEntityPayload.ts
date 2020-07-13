import { MediaType } from '../enum/MediaEnums';
import { FileMetadata } from '../../value-object/FileMetadata';

export type CreateMediaEntityPayload = {
  ownerId: string,
  name: string,
  type: MediaType,
  metadata: FileMetadata
};
