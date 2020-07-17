import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { MediaUseCaseDto } from '../../../domain/media/usecase/dto/MediaUseCaseDto';
import { Media } from '../../../domain/media/entity/Media';
import { EditMediaUseCase } from '../../../domain/media/usecase/EditMediaUseCase';
import { EditMediaPort } from '../../../domain/media/port/usecase/EditMediaPort';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

export class EditMediaService implements EditMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: EditMediaPort): Promise<MediaUseCaseDto> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({id: payload.mediaId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'})
    );
    
    const hasAccess: boolean = payload.executorId === media.getOwnerId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    await media.edit({name: payload.name});
    await this.mediaRepository.updateMedia(media);
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
