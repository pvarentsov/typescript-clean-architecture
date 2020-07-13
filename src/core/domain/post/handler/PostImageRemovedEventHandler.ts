import { EventHandler } from '../../../common/cqers/event/EventHandler';
import { MediaRemovedEvent } from '../../../common/cqers/event/events/media/MediaRemovedEvent';

export interface PostImageRemovedEventHandler extends EventHandler<MediaRemovedEvent> {}
