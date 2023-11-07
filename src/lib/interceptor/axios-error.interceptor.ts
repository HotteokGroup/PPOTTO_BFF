import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

import { ErrorObject } from '../exception/error.constant';

@Injectable()
export class AxiosErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.isAxiosError) {
          const customResponse: ErrorObject<string> = {
            errorCode: error.response?.data?.errorCode,
            status: error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.response?.data?.message || error.message,
          };
          return throwError(() => new HttpException(customResponse, customResponse.status));
        }
        return throwError(() => error);
      }),
    );
  }
}
