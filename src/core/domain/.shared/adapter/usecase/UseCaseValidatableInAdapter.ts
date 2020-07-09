import { Optional } from '../../type/CommonTypes';
import { ClassValidationDetails, ClassValidator } from '../../util/class-validator/ClassValidator';
import { Exception } from '../../exception/Exception';
import { Code } from '../../code/Code';

export class UseCaseValidatableInAdapter {
  
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw Exception.new({code: Code.USE_CASE_PORT_VALIDATION_ERROR, data: details});
    }
  }
  
}
