import { MediaType } from '@core/common/enums/MediaEnums';

export class MediaRemovedEvent {
  
  public readonly mediaId: string;
  
  public readonly ownerId: string;
  
  public readonly type: MediaType;
  
  private constructor(mediaId: string, ownerId: string, type: MediaType) {
    this.mediaId = mediaId;
    this.ownerId = ownerId;
    this.type = type;
  }
  
  public static new(mediaId: string, ownerId: string, type: MediaType): MediaRemovedEvent {
    return new MediaRemovedEvent(mediaId, ownerId, type);
  }
  
}
