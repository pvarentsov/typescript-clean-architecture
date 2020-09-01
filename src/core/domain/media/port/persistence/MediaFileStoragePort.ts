import { MediaFileStorageOptions } from '@core/common/persistence/MediaFileStorageOptions';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';

export interface MediaFileStoragePort {
  upload(file: Buffer|NodeJS.ReadableStream, options: MediaFileStorageOptions): Promise<FileMetadata>;
}
