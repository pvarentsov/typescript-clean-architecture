import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { MediaUseCaseDto } from '../../../domain/media/usecase/dto/MediaUseCaseDto';
import { Media } from '../../../domain/media/entity/Media';
import { EditMediaUseCase } from '../../../domain/media/usecase/EditMediaUseCase';
import { EditMediaPort } from '../../../domain/media/port/usecase/EditMediaPort';
import { Optional } from '../../../shared/type/CommonTypes';
import { Exception } from '../../../shared/exception/Exception';
import { Code } from '../../../shared/code/Code';

export class EditMediaService implements EditMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: EditMediaPort): Promise<MediaUseCaseDto> {
    const media: Optional<Media> = await this.mediaRepository.findMedia({id: payload.mediaId});
    if (!media) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'});
    }
    
    await media.edit({name: payload.name});
    await this.mediaRepository.updateMedia(media);
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
