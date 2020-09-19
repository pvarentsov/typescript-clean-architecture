import { DoesMediaExistQuery } from '@core/common/message/query/queries/media/DoesMediaExistQuery';
import { RepositoryFindOptions } from '@core/common/persistence/RepositoryOptions';
import { v4 } from 'uuid';

describe('DoesMediaExistQuery', () => {

  describe('new', () => {
  
    test('When input args are empty, expect it creates DoesMediaExistQuery instance with default parameters', () => {
      const doesMediaExistQuery: DoesMediaExistQuery = DoesMediaExistQuery.new({});
      
      expect(doesMediaExistQuery.by).toEqual({});
      expect(doesMediaExistQuery.options).toBeUndefined();
    });
  
    test('When input args are set, expect it creates DoesMediaExistQuery instance with custom parameters', () => {
      const customBy: {id?: string, ownerId?: string} = {id: v4(), ownerId: v4()};
      const customFindOptions: RepositoryFindOptions = {limit: 10, offset: 0};
      
      const doesMediaExistQuery: DoesMediaExistQuery = DoesMediaExistQuery.new(customBy, customFindOptions);
    
      expect(doesMediaExistQuery.by).toEqual(customBy);
      expect(doesMediaExistQuery.options).toEqual(customFindOptions);
    });
    
  });
  
});
