import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaPort } from '@core/domain/media/port/usecase/GetMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaUseCase } from '@core/domain/media/usecase/GetMediaUseCase';

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
