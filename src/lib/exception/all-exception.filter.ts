import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import type { Response } from 'express';

import { ERROR_CODE, ErrorObject, isErrorObject } from './error.constant';
import { UserApiException } from '../../internal/user/user-api-client.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 기본 에러코드는 INTERNAL_SERVER_ERROR
    const errorInfo: ErrorObject<string> = ERROR_CODE.INTERNAL_SERVER_ERROR;

    const { method, url } = request;

    // 내부 API 예외 처리
    if (exception instanceof UserApiException) {
      // BFF에서 정의된 일관된 메시지 세팅
      errorInfo.errorCode = exception.getErrorCode();
      errorInfo.message = exception.getErrorMessage();
      errorInfo.status = exception.getHttpStatus();

      // 내부 API 에러 메시지
      const internalErrorInfo = exception.getInternalErrorInfo();
      Logger.error(`[${exception.name}][${method} ${url}] ${JSON.stringify(internalErrorInfo)}`);
      Logger.error(exception.stack);
    }
    // BFF 내부의 에러인 경우
    else if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      if (isErrorObject(errorResponse)) {
        errorInfo.errorCode = errorResponse.errorCode;
        errorInfo.message = errorResponse.message;
        errorInfo.status = errorResponse.status;
      } else {
        // 에러 object로 전달되지 않은경우, 에러메시지와 상태코드만 전달
        errorInfo.message = exception.message;
        errorInfo.status = exception.getStatus();
      }

      Logger.error(`[BFF Exception][${method} ${url}] ${exception.message}`, exception.stack);
    } else {
      // 에러코드가 없는경우, 에러메시지만 전달
      errorInfo.message = (exception as { message: string }).message;
      Logger.error(`[BFF Exception][${method} ${url}] ${errorInfo.message}`);
    }

    // 서비스에서 예상치 않은 에러가 발생한 경우
    if (errorInfo.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error('서비스에서 핸들링하지않은 에러 발생', exception);
    }

    response.status(errorInfo.status).json(errorInfo);
  }
}
