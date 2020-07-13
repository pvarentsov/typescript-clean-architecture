import { Readable } from 'stream';
import { FileMetadata } from '../../value-object/FileMetadata';
import { FileStorageUploadOptions } from '../../../../shared/persistence/FileStorageOptions';

export interface MediaFileStoragePort {
  upload(file: Buffer|Readable, options: FileStorageUploadOptions): Promise<FileMetadata>;
}
