import { GetUserPreviewQuery } from '@core/common/message/query/queries/user/GetUserPreviewQuery';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';
import { v4 } from 'uuid';

describe('GetUserPreviewQuery', () => {

  describe('new', () => {
  
    test('When input options are empty, expect it creates GetUserPreviewQuery instance with default parameters', () => {
      const customBy: {id: string} = {id: v4()};
      const getUserPreviewQuery: GetUserPreviewQuery = GetUserPreviewQuery.new(customBy);
      
      expect(getUserPreviewQuery.by).toEqual(customBy);
      expect(getUserPreviewQuery.options).toBeUndefined();
    });
  
    test('When input args are set, expect it creates GetUserPreviewQuery instance with custom parameters', () => {
      const customBy: {id: string} = {id: v4()};
      const customFindOptions: RepositoryFindOptions = {limit: 42, offset: 0};
      
      const getUserPreviewQuery: GetUserPreviewQuery = GetUserPreviewQuery.new(customBy, customFindOptions);
    
      expect(getUserPreviewQuery.by).toEqual(customBy);
      expect(getUserPreviewQuery.options).toEqual(customFindOptions);
    });
    
  });
  
});
