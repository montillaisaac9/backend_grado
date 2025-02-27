import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { IErrorResponse, IResponse } from '../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseObj = exception.getResponse();

      if (typeof responseObj === 'string') {
        errorMessage = responseObj;
      } else if (typeof responseObj === 'object' && responseObj !== null) {
        const { error, message } = responseObj as {
          error?: string;
          message?: string | string[];
        };
        errorMessage =
          error ||
          (Array.isArray(message)
            ? message.join(', ')
            : message || 'Unknown error');
      }
    } else {
      exception = new InternalServerErrorException('Error inesperado');
    }

    const errorResponse: IErrorResponse = {
      statusCode: status,
      path: request.url,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };

    const finalResponse: IResponse<null> = {
      success: false,
      data: null,
      error: errorResponse,
    };

    response.status(status).json(finalResponse);
  }
}
