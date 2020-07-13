import { Readable } from 'stream';
import { FileMetadata } from '../../value-object/FileMetadata';
import { MediaFileStorageOptions } from '../../../../common/persistence/MediaFileStorageOptions';

export interface MediaFileStoragePort {
  upload(file: Buffer|Readable, options: MediaFileStorageOptions): Promise<FileMetadata>;
}
