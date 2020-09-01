import { EventHandler } from '@core/common/cqers/event/EventHandler';
import { MediaRemovedEvent } from '@core/common/cqers/event/events/media/MediaRemovedEvent';

export interface PostImageRemovedEventHandler extends EventHandler<MediaRemovedEvent> {}
