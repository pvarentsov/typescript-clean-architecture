import { GetMediaPreviewQueryResult } from '../../../../../../../../../src/core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { v4 } from 'uuid';
import { MediaType } from '../../../../../../../../../src/core/common/enums/MediaEnums';

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
