import { Optional } from '@core/common/type/CommonTypes';
import { validate, ValidationError } from 'class-validator';

export type ClassValidationDetails = {
  context: string;
  errors : ClassValidationErrors[],
};

export type ClassValidationErrors = {
  property: string,
  message: string[]
};

export class ClassValidator {
  
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static async validate<TTarget extends object>(target: TTarget, context?: string): Promise<Optional<ClassValidationDetails>> {
    let details: Optional<ClassValidationDetails>;
    const errors: ValidationError[] = await validate(target);
    
    if (errors.length > 0) {
      details = {
        context: context || target.constructor.name,
        errors : []
      };
      for (const error of errors) {
        details.errors.push({
          property: error.property,
          message : error.constraints ? Object.values(error.constraints) : []
        });
      }
    }
    
    return details;
  }
  
}
