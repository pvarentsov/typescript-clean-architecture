import { MediaType } from '@core/common/enums/MediaEnums';

export class GetMediaPreviewQueryResult {
  
  public readonly id: string;
  
  public readonly type: MediaType;
  
  public readonly relativePath: string;
  
  constructor(id: string, type: MediaType, relativePath: string) {
    this.id = id;
    this.type = type;
    this.relativePath = relativePath;
  }
  
  public static new(id: string, type: MediaType, relativePath: string): GetMediaPreviewQueryResult {
    return new GetMediaPreviewQueryResult(id, type, relativePath);
  }
  
}
