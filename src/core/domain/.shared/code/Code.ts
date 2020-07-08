export type CodeDescription = {
  code: number,
  message: string,
}

export class Code {
  
  public static ENTITY_NOT_FOUND_ERROR: CodeDescription = {
    code: 100,
    message: 'Entity not found.'
  }
  
  public static ENTITY_VALIDATION_ERROR: CodeDescription = {
    code: 101,
    message: 'Entity validation error.'
  }
  
}
