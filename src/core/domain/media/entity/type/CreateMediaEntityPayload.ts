import { MediaType } from '../enum/PostEnums';
import { FileMetadata } from '../../value-object/FileMetadata';

export type CreateMediaEntityPayload = {
  ownerId: string,
  name: string,
  type: MediaType,
  metadata: FileMetadata
};
