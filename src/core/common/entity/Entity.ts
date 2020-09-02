import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Optional } from '@core/common/type/CommonTypes';
import { ClassValidationDetails, ClassValidator } from '@core/common/util/class-validator/ClassValidator';

export class Entity<TIdentifier extends string|number> {
  
  protected id: Optional<TIdentifier>;
  
  public getId(): TIdentifier {
    if (typeof this.id === 'undefined') {
      throw Exception.new({code: Code.ENTITY_VALIDATION_ERROR, overrideMessage: `${this.constructor.name}: ID is empty.`});
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
