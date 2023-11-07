import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import type { Response } from 'express';

import { ERROR_CODE, ErrorObject, isErrorObject } from './error.constant';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // 기본 에러코드는 INTERNAL_SERVER_ERROR
    const errorInfo: ErrorObject<string> = ERROR_CODE.INTERNAL_SERVER_ERROR;

    // 에러코드가 존재하고, 해당 에러코드가 정의된 에러코드라면 해당 에러코드로 변경
    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as any;
      if (isErrorObject(errorResponse)) {
        errorInfo.errorCode = errorResponse.errorCode;
        errorInfo.message = errorResponse.message;
        errorInfo.status = errorResponse.status;
      } else {
        // 에러 object로 전달되지 않은경우, 에러메시지와 상태코드만 전달
        errorInfo.message = errorResponse.message;
        errorInfo.status = exception.getStatus();
      }
    } else {
      // 에러코드가 없는경우, 에러메시지만 전달
      errorInfo.message = exception.message;
    }

    if (errorInfo.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error('서비스에서 핸들링하지않은 에러 발생', exception);
    }

    response.status(errorInfo.status).json(errorInfo);
  }
}
