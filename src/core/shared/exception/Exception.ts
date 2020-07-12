import { CodeDescription } from '../code/Code';
import { Optional } from '../type/CommonTypes';

export type CreateExceptionPayload<TData extends Record<string, unknown>> = {
  code: CodeDescription,
  overrideMessage?: string,
  data?: TData
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class Exception<TData extends object> extends Error {
  
  public readonly code: number;
  
  public readonly data: Optional<TData>;
  
  private constructor(codeDescription: CodeDescription, overrideMessage?: string, data?: TData) {
    super();
    
    this.name = this.constructor.name;
    this.code = codeDescription.code;
    this.data = data;
    this.message = overrideMessage || codeDescription.message;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  public static new<TData extends Record<string, unknown>>(payload: CreateExceptionPayload<TData>): Exception<TData> {
    return new Exception(payload.code, payload.overrideMessage, payload.data);
  }
  
}
