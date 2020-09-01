import { MediaType } from '@core/common/enums/MediaEnums';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';

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
