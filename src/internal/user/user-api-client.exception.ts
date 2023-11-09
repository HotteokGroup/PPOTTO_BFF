import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

import { ErrorObject } from '../../lib/exception/error.constant';

export class UserApiException extends HttpException {
  private httpStatus: HttpStatus;

  private errorCode: string;

  private errorMessage: string;

  private error: AxiosError | Error;

  constructor(errorObject: ErrorObject<string>, error: AxiosError | Error) {
    super(error, HttpStatus.INTERNAL_SERVER_ERROR);

    this.errorCode = errorObject.errorCode;
    this.httpStatus = errorObject.status;
    this.errorMessage = errorObject.message;
    this.error = error;
  }

  getErrorCode() {
    return this.errorCode;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  getHttpStatus() {
    return this.httpStatus;
  }

  getError() {
    return this.error;
  }

  getInternalErrorInfo() {
    return this.error instanceof AxiosError ? this.error.response?.data : this.error.message;
  }
}
