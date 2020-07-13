import { PostImageRemovedEventHandler } from '../../../domain/post/handler/PostImageRemovedEventHandler';
import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { MediaRemovedEvent } from '../../../common/cqers/event/events/media/MediaRemovedEvent';
import { MediaType } from '../../../common/enums/MediaEnums';

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
