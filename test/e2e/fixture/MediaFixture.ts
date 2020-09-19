import { MediaType } from '@core/common/enums/MediaEnums';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/CreateFileMetadataValueObjectPayload';
import { TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

export class MediaFixture {
  
  constructor(
    private readonly testingModule: TestingModule
  ) {}
  
  public async insertMedia(payload?: {ownerId?: string}): Promise<Media> {
    const mediaRepository: MediaRepositoryPort = this.testingModule.get(MediaDITokens.MediaRepository);
  
    const id: string = v4();
    const createdAt: Date = new Date(Date.now() - 3000);
    const editedAt: Date = new Date(Date.now() - 1000);
  
    const metadataPayload: CreateFileMetadataValueObjectPayload = {
      relativePath: `images/${v4()}.png`,
      size        : 42_000_000,
      ext         : 'png',
      mimetype    : 'image/png'
    };
  
    const media: Media = await Media.new({
      ownerId  : payload?.ownerId || v4(),
      name     : v4(),
      type     : MediaType.IMAGE,
      metadata : await FileMetadata.new(metadataPayload),
      id       : id,
      createdAt: createdAt,
      editedAt : editedAt,
    });
    
    await mediaRepository.addMedia(media);
    
    return media;
  }
  
  public static new(testingModule: TestingModule): MediaFixture {
    return new MediaFixture(testingModule);
  }
  
}