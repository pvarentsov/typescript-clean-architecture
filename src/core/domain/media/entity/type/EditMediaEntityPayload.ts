import { FileMetadata } from '../../value-object/FileMetadata';

export type EditMediaEntityPayload = {
  name?: string,
  metadata?: FileMetadata
};
