import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

import { ErrorObject } from '../../lib/exception/error.constant';

export class UserClientException extends HttpException {
  private httpStatus: HttpStatus;

  private errorCode: string;

  private errorMessage: string;

  private error: AxiosError | Error;

  private errorObject: ErrorObject<string>;

  constructor(errorObject: ErrorObject<string>, error: AxiosError) {
    super(error, HttpStatus.INTERNAL_SERVER_ERROR);

    this.errorCode = errorObject.errorCode;
    this.httpStatus = errorObject.status;
    this.errorMessage = errorObject.message;
    this.errorObject = errorObject;
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

  getErrorInfo(): ErrorObject<string> {
    return this.errorObject;
  }
}
