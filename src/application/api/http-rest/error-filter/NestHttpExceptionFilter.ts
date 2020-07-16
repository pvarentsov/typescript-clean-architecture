import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Exception } from '../../../../core/common/exception/Exception';
import { ApiResponse } from '../../../../core/common/api/ApiResponse';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();
    
    let errorResponse: ApiResponse<unknown> = ApiResponse.error();
  
    errorResponse = this.handleNestError(error, errorResponse);
    errorResponse = this.handleDomainException(error, errorResponse);
    
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
    
    return errorResponse;
  }
  
  private handleDomainException(error: Error, errorResponse: ApiResponse<unknown>): ApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = ApiResponse.error(error.code, error.message, error.data);
    }
    
    return errorResponse;
  }

}
