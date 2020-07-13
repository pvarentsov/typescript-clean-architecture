import { EventHandler } from '../../../shared/cqers/event/EventHandler';
import { MediaRemovedEvent } from '../../../shared/cqers/event/events/media/MediaRemovedEvent';

export interface PostImageRemovedEventHandler extends EventHandler<MediaRemovedEvent> {}
