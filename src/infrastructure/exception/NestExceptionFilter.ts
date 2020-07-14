import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NestExceptionFilter implements ExceptionFilter {
  
  public catch(error: Error, host: ArgumentsHost): void {
    const response: Response = host.switchToHttp().getResponse<Response>();
    response.json(error);
  }

}
