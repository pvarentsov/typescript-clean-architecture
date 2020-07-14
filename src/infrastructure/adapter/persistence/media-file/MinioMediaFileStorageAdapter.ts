import { MediaFileStoragePort } from '../../../../core/domain/media/port/persistence/MediaFileStoragePort';
import * as Minio from 'minio';
import { BucketItemStat } from 'minio';
import { Readable } from 'stream';
import { MediaFileStorageOptions } from '../../../../core/common/persistence/MediaFileStorageOptions';
import { FileMetadata } from '../../../../core/domain/media/value-object/FileMetadata';
import { v4 } from 'uuid';

/**
 * TODO:
 * 1. Add config
 * 2. Remove hardcode
 */

export class MinioMediaFileStorageAdapter implements MediaFileStoragePort {
  
  private client: Minio.Client = new Minio.Client({
    endPoint : 'localhost',
    port     : 9000,
    accessKey: 'aid6jaeng6IeWahv6hae',
    secretKey: 'ri5aX5Meishi9haihooB',
    useSSL   : false
  });
  
  public async upload(file: Buffer | Readable, options: MediaFileStorageOptions): Promise<FileMetadata> {
    const bucket: string = 'images';
    const key: string    = `${v4()}.png`;
    
    await this.client.putObject(bucket, key, file, {
      'Content-Type': 'image/png',
      'Public'      : options.public,
      'Type'        : options.type
    });
    
    const fileStat: BucketItemStat = await this.client.statObject(bucket, key);
    
    const fileMetadata: FileMetadata = await FileMetadata.new({
      relativePath: `${bucket}/${key}`,
      size        : fileStat.size,
      mimetype    : fileStat.metaData['Content-Type'],
      ext         : 'png'
    });
    
    return fileMetadata;
  }
  
}
