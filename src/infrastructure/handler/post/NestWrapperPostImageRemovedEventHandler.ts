import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { MediaRemovedEvent } from '@core/common/cqers/event/events/media/MediaRemovedEvent';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { PostImageRemovedEventHandler } from '@core/domain/post/handler/PostImageRemovedEventHandler';

@Injectable()
@EventsHandler(MediaRemovedEvent)
export class NestWrapperPostImageRemovedEventHandler implements IEventHandler {
  
  constructor(
    @Inject(PostDITokens.PostImageRemovedEventHandler)
    private readonly handleService: PostImageRemovedEventHandler
  ) {}

  public async handle(event: MediaRemovedEvent): Promise<void> {
    return this.handleService.handle(event);
  }
  
}
