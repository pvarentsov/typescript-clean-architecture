import { Optional } from '../type/CommonTypes';
import { ClassValidationDetails, ClassValidator } from '../util/class-validator/ClassValidator';
import { Exception } from '../exception/Exception';
import { Code } from '../code/Code';

export class ValueObject {
  
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({code: Code.VALUE_OBJECT_VALIDATION_ERROR, data: details});
    }
  }
  
}
