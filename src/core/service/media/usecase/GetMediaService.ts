import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { MediaUseCaseDto } from '../../../domain/media/usecase/dto/MediaUseCaseDto';
import { Media } from '../../../domain/media/entity/Media';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { GetMediaPort } from '../../../domain/media/port/usecase/GetMediaPort';
import { GetMediaUseCase } from '../../../domain/media/usecase/GetMediaUseCase';
import { CoreAssert } from '../../../common/util/assert/CoreAssert';

export class GetMediaService implements GetMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}
  
  public async execute(payload: GetMediaPort): Promise<MediaUseCaseDto> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({id: payload.mediaId}),
      Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'})
    );
  
    const hasAccess: boolean = payload.executorId === media.getOwnerId();
    CoreAssert.isTrue(hasAccess, Exception.new({code: Code.ACCESS_DENIED_ERROR}));
    
    return MediaUseCaseDto.newFromMedia(media);
  }
  
}
