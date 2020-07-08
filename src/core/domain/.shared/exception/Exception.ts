import { CodeDescription } from '../code/Code';

export class Exception extends Error {
  
  public readonly code: number
  
  private constructor(codeDescription: CodeDescription, overrideMessage?: string) {
    super();
    
    this.name = this.constructor.name;
    this.message = overrideMessage || codeDescription.message;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  public static new(codeDescription: CodeDescription, overrideMessage?: string): Exception {
    return new Exception(codeDescription, overrideMessage);
  }
  
}
