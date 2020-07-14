import { MediaType } from '../../../../common/enums/MediaEnums';
import { FileMetadata } from '../../value-object/FileMetadata';

export type CreateMediaEntityPayload = {
  ownerId: string,
  name: string,
  type: MediaType,
  metadata: FileMetadata,
  id?: string,
  createdAt?: Date,
  editedAt?: Date,
  removedAt?: Date,
};
