import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
        statusCode: status,
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal server error',
        stack: exception instanceof Error ? exception.stack : null,
        timestamp: new Date().toISOString(),
      };
  
      response.status(status).json(errorResponse);
    }
  }
  