import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaListPort } from '@core/domain/media/port/usecase/GetMediaListPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaListUseCase } from '@core/domain/media/usecase/GetMediaListUseCase';

export class GetMediaListService implements GetMediaListUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: GetMediaListPort): Promise<MediaUseCaseDto[]> {
    const medias: Media[] = await this.mediaRepository.findMedias({ownerId: payload.executorId});
    return MediaUseCaseDto.newListFromMedias(medias);
  }
  
}
