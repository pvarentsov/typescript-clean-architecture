import { FileMetadata } from '../../value-object/FileMetadata';
import { MediaFileStorageOptions } from '../../../../common/persistence/MediaFileStorageOptions';

export interface MediaFileStoragePort {
  upload(file: Buffer|NodeJS.ReadableStream, options: MediaFileStorageOptions): Promise<FileMetadata>;
}
