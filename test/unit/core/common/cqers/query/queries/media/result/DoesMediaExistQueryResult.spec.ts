import { DoesMediaExistQueryResult } from '@core/common/message/query/queries/media/result/DoesMediaExistQueryResult';

describe('DoesMediaExistQueryResult', () => {

  describe('new', () => {
  
    test('Expect it creates DoesMediaExistQueryResult instance with required parameters', () => {
      const doesMediaExistQueryResult: DoesMediaExistQueryResult = DoesMediaExistQueryResult.new(true);
      expect(doesMediaExistQueryResult.doesExist).toBeTruthy();
    });
    
  });
  
});
