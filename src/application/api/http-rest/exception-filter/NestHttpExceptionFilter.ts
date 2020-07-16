import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../../../../core/common/exception/Exception';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';
import { Code } from '../../../../core/common/code/Code';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();
    
    let errorResponse: ApiResponse<unknown> = ApiResponse.error();
  
    errorResponse = this.handleNestError(error, errorResponse);
    errorResponse = this.handleCoreException(error, errorResponse);
    
    const message: string =
      `Method: ${request.method}; ` +
      `Path: ${request.path}; `+
      `Error: ${errorResponse.message}`;
  
    Logger.error(message);
    
    response.json(errorResponse);
  }
  
  private handleNestError(error: Error, errorResponse: ApiResponse<unknown>): ApiResponse<unknown> {
    if (error instanceof HttpException) {
      errorResponse = ApiResponse.error(error.getStatus(), error.message, null);
    }
    if (error instanceof UnauthorizedException) {
      errorResponse = ApiResponse.error(Code.UNAUTHORIZED_ERROR.code, Code.UNAUTHORIZED_ERROR.message, null);
    }
    
    return errorResponse;
  }
  
  private handleCoreException(error: Error, errorResponse: ApiResponse<unknown>): ApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = ApiResponse.error(error.code, error.message, error.data);
    }
    
    return errorResponse;
  }

}
