import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { MediaType } from '@core/common/enums/MediaEnums';
import { v4 } from 'uuid';

describe('GetMediaPreviewQueryResult', () => {

  describe('new', () => {
  
    test('Expect it creates GetMediaPreviewQueryResult instance with required parameters', () => {
      const mediaId: string = v4();
      const mediaType: MediaType = MediaType.IMAGE;
      const relativePath: string = '/relative/path';
      
      const getMediaPreviewQueryResult: GetMediaPreviewQueryResult = GetMediaPreviewQueryResult.new(mediaId, mediaType, relativePath);
      
      expect(getMediaPreviewQueryResult.id).toBe(mediaId);
      expect(getMediaPreviewQueryResult.type).toBe(mediaType);
      expect(getMediaPreviewQueryResult.relativePath).toBe(relativePath);
    });
    
  });
  
});
