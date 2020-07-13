import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { MediaUseCaseDto } from '../../../domain/media/usecase/dto/MediaUseCaseDto';
import { Media } from '../../../domain/media/entity/Media';
import { Optional } from '../../../shared/type/CommonTypes';
import { Exception } from '../../../shared/exception/Exception';
import { Code } from '../../../shared/code/Code';
import { GetMediaPort } from '../../../domain/media/port/usecase/GetMediaPort';
import { GetMediaUseCase } from '../../../domain/media/usecase/GetMediaUseCase';

export class GetMediaService implements GetMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: GetMediaPort): Promise<MediaUseCaseDto> {
    const media: Optional<Media> = await this.mediaRepository.findMedia({id: payload.mediaId});
    if (!media) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'});
    }
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
