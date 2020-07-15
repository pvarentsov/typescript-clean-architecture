import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Exception } from '../../core/common/exception/Exception';

@Catch()
export class NestExceptionFilter implements ExceptionFilter {
  
  public catch(error: Error, host: ArgumentsHost): void {
    Logger.error(error.message, error.stack, NestExceptionFilter.name);
    const response: Response = host.switchToHttp().getResponse<Response>();
    
    response.json(Object.assign({
      message: error.message,
      code: (error as Exception<Record<string, unknown>>).code,
      data: (error as Exception<Record<string, unknown>>).data
    }));
  }

}
