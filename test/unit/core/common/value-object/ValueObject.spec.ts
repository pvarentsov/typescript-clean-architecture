import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { ValueObject } from '@core/common/value-object/ValueObject';
import { IsString } from 'class-validator';

class MockValueObject extends ValueObject {
  @IsString()
  public address: string;
  
  constructor(address: string) {
    super();
    this.address = address;
  }
}

describe('ValueObject', () => {
  
  describe('validate', () => {
  
    test('When MockValueObject is valid, expect it doesn\'t throw Exception', async () => {
      const validValueObject: MockValueObject = new MockValueObject('The Tower of the Swallow');
      await expect(validValueObject.validate()).resolves.toBeUndefined();
    });
  
    test('When MockValueObject is not valid, expect it throws Exception', async () => {
      const address: unknown = 42;
      const invalidValueObject: MockValueObject = new MockValueObject(address as string);
  
      expect.hasAssertions();
  
      try {
        await invalidValueObject.validate();
        
      } catch (e) {
        
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
        
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.VALUE_OBJECT_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('address');
      }
    });
    
  });
  
});
