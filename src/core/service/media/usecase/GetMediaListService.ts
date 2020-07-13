import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { MediaUseCaseDto } from '../../../domain/media/usecase/dto/MediaUseCaseDto';
import { Media } from '../../../domain/media/entity/Media';
import { GetMediaListUseCase } from '../../../domain/media/usecase/GetMediaListUseCase';
import { GetMediaListPort } from '../../../domain/media/port/usecase/GetMediaListPort';

export class GetMediaListService implements GetMediaListUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: GetMediaListPort): Promise<MediaUseCaseDto[]> {
    const medias: Media[] = await this.mediaRepository.findMedias({ownerId: payload.executorId});
    return MediaUseCaseDto.newListFromMedias(medias);
  }
  
}
