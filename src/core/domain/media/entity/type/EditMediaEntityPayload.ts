import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';

export type EditMediaEntityPayload = {
  name?: string,
  metadata?: FileMetadata
};
