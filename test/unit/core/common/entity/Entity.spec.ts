import { Code } from '@core/common/code/Code';
import { Entity } from '@core/common/entity/Entity';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { IsString } from 'class-validator';
import { v4 } from 'uuid';

class MockEntity extends Entity<string> {
  @IsString()
  public name: string;
  
  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
}

describe('Entity', () => {
  
  describe('getId', () => {
  
    test('When id is set, expect it returns id', async () => {
      const id: string = v4();
      const entity: MockEntity = new MockEntity(id, 'Triss');
      
      expect(entity.getId()).toBe(id);
    });
  
    test('When id is not set, expect it throws Exception', async () => {
      const id: unknown = undefined;
      const entity: MockEntity = new MockEntity(id as string, 'Triss');
      
      expect.hasAssertions();
      
      try {
        await entity.getId();
        
      } catch (e) {
        
        const exception: Exception<void> = e as Exception<void>;
        
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_VALIDATION_ERROR.code);
        expect(exception.message).toBe('MockEntity: ID is empty.');
      }
    });
    
  });
  
  describe('validate', () => {
  
    test('When MockEntity is valid, expect it doesn\'t throw Exception', async () => {
      const validEntity: MockEntity = new MockEntity(v4(), 'Cirilla');
      await expect(validEntity.validate()).resolves.toBeUndefined();
    });
  
    test('When MockEntity is not valid, expect it throws Exception', async () => {
      const name: unknown = 42;
      const invalidEntity: MockEntity = new MockEntity(v4(), name as string);
  
      expect.hasAssertions();
  
      try {
        await invalidEntity.validate();
        
      } catch (e) {
        
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
        
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('name');
      }
    });
    
  });
  
});
