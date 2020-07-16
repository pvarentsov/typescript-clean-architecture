export type CodeDescription = {
  code: number,
  message: string,
};

export class Code {
  
  // Common
  
  public static SUCCESS: CodeDescription = {
    code: 200,
    message: 'Success.'
  };
  
  public static INTERNAL_ERROR: CodeDescription = {
    code: 500,
    message: 'Internal error.'
  };
  
  // Domain
  
  public static ENTITY_NOT_FOUND_ERROR: CodeDescription = {
    code: 100,
    message: 'Entity not found.'
  };
  
  public static ENTITY_VALIDATION_ERROR: CodeDescription = {
    code: 101,
    message: 'Entity validation error.'
  };
  
  public static USE_CASE_PORT_VALIDATION_ERROR: CodeDescription = {
    code: 102,
    message: 'Use-case port validation error.'
  };
  
  public static VALUE_OBJECT_VALIDATION_ERROR: CodeDescription = {
    code: 103,
    message: 'Value object validation error.'
  };
  
  public static ENTITY_ALREADY_EXISTS_ERROR: CodeDescription = {
    code: 104,
    message: 'Entity already exists.'
  };
  
}
