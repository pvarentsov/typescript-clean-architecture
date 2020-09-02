import { CoreAssert } from '@core/common/util/assert/CoreAssert';

describe('CoreAssert', () => {
  
  const AssertionError: Error = new Error('AssertionError');

  describe('isTrue', () => {
  
    test('When expression is TRUE, expect it doesn\'t throw error', () => {
      expect(CoreAssert.isTrue(true, AssertionError)).toBeUndefined();
    });
  
    test('When expression is FALSE, expect it throws error', () => {
      expect.hasAssertions();
      
      try {
        CoreAssert.isTrue(false, AssertionError);
      } catch (e) {
        expect(e).toEqual(AssertionError);
      }
    });
    
  });
  
  describe('isFalse', () => {
    
    test('When expression is FALSE, expect it doesn\'t throw error', () => {
      expect(CoreAssert.isFalse(false, AssertionError)).toBeUndefined();
    });
    
    test('When expression is TRUE, expect it throws error', () => {
      expect.hasAssertions();
      
      try {
        CoreAssert.isFalse(true, AssertionError);
      } catch (e) {
        expect(e).toEqual(AssertionError);
      }
    });
    
  });
  
  describe('notEmpty', () => {
    
    test('When expression is not <NULL|UNDEFINED>, expect it returns expression', () => {
      expect(CoreAssert.notEmpty({}, AssertionError)).toEqual({});
    });
    
    test('When expression is NULL, expect it throws error', () => {
      expect.hasAssertions();
      
      try {
        CoreAssert.notEmpty(null, AssertionError);
      } catch (e) {
        expect(e).toEqual(AssertionError);
      }
    });
  
    test('When expression is UNDEFINED, expect it throws error', () => {
      expect.hasAssertions();
    
      try {
        CoreAssert.notEmpty(undefined, AssertionError);
      } catch (e) {
        expect(e).toEqual(AssertionError);
      }
    });
    
  });
  
});
