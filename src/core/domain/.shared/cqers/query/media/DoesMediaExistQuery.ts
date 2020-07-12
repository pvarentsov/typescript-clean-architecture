export class DoesMediaExistQuery {
  
  mediaId: string;
  
  includeRemoved?: boolean;
  
  private constructor(mediaId: string, includeRemoved?: boolean) {
    this.mediaId = mediaId;
    this.includeRemoved = includeRemoved;
  }
  
  public static new(mediaId: string, includeRemoved?: boolean): DoesMediaExistQuery {
    return new DoesMediaExistQuery(mediaId, includeRemoved);
  }
}
