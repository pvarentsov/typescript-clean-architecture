import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';
import { v4 } from 'uuid';

describe('GetMediaPreviewQuery', () => {

  describe('new', () => {
  
    test('When input args are empty, expect it creates GetMediaPreviewQuery instance with default parameters', () => {
      const getMediaPreviewQuery: GetMediaPreviewQuery = GetMediaPreviewQuery.new({});
      
      expect(getMediaPreviewQuery.by).toEqual({});
      expect(getMediaPreviewQuery.options).toBeUndefined();
    });
  
    test('When input args are set, expect it creates GetMediaPreviewQuery instance with custom parameters', () => {
      const customBy: {id?: string, ownerId?: string} = {id: v4(), ownerId: v4()};
      const customFindOptions: RepositoryFindOptions = {limit: 10, offset: 0};
      
      const getMediaPreviewQuery: GetMediaPreviewQuery = GetMediaPreviewQuery.new(customBy, customFindOptions);
    
      expect(getMediaPreviewQuery.by).toEqual(customBy);
      expect(getMediaPreviewQuery.options).toEqual(customFindOptions);
    });
    
  });
  
});
