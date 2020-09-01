import { CreateMediaUseCase } from '@core/domain/media/usecase/CreateMediaUseCase';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/MediaFileStoragePort';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { Media } from '@core/domain/media/entity/Media';

export class CreateMediaService implements CreateMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly mediaFileStorage: MediaFileStoragePort,
  ) {}
  
  public async execute(payload: CreateMediaPort): Promise<MediaUseCaseDto> {
    const fileMetaData: FileMetadata = await this.mediaFileStorage.upload(payload.file, {type: payload.type});
    
    const media: Media = await Media.new({
      ownerId: payload.executorId,
      name: payload.name,
      type: payload.type,
      metadata: fileMetaData,
    });
    
    await this.mediaRepository.addMedia(media);
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
