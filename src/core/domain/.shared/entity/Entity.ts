import { Optional } from '../type/CommonTypes';
import { ClassValidationDetails, ClassValidator } from '../util/class-validator/ClassValidator';
import { Exception } from '../exception/Exception';
import { Code } from '../code/Code';

export class Entity<TIdentifier extends string|number> {
  
  protected id: Optional<TIdentifier>;
  
  public getId(): TIdentifier {
    if (typeof this.id === 'undefined') {
      const message: string = `${this.constructor.name}: ID is empty.`
      throw Exception.new({code: Code.ENTITY_VALIDATION_ERROR, overrideMessage: message})
    }
    
    return this.id;
  }
  
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({code: Code.ENTITY_VALIDATION_ERROR, data: details});
    }
  }
  
}
