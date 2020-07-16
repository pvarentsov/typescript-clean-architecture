import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { Media } from '../../../domain/media/entity/Media';
import { Optional } from '../../../common/type/CommonTypes';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { RemoveMediaUseCase } from '../../../domain/media/usecase/RemoveMediaUseCase';
import { RemoveMediaPort } from '../../../domain/media/port/usecase/RemoveMediaPort';
import { EventBusPort } from '../../../common/port/cqers/EventBusPort';
import { MediaRemovedEvent } from '../../../common/cqers/event/events/media/MediaRemovedEvent';

export class RemoveMediaService implements RemoveMediaUseCase {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly eventBus: EventBusPort,
  ) {}
  
  public async execute(payload: RemoveMediaPort): Promise<void> {
    const media: Optional<Media> = await this.mediaRepository.findMedia({id: payload.mediaId});
    if (!media) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.'});
    }
    
    await this.mediaRepository.removeMedia(media);
    await this.eventBus.sendEvent(MediaRemovedEvent.new(media.getId(), media.getOwnerId(), media.getType()));
  }
  
}
