import { MediaRemovedEvent } from '@core/common/message/event/events/media/MediaRemovedEvent';
import { MediaType } from '@core/common/enums/MediaEnums';
import { PostImageRemovedEventHandler } from '@core/domain/post/handler/PostImageRemovedEventHandler';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';

export class HandlePostImageRemovedEventService implements PostImageRemovedEventHandler {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async handle(event: MediaRemovedEvent): Promise<void> {
    if (event.type === MediaType.IMAGE) {
      await this.postRepository.updatePosts({imageId: null}, {imageId: event.mediaId});
    }
  }
  
}
