import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export interface ErrorObject<T> {
  errorCode: T;
  message: string;
  status: HttpStatus;
}

const dynamicRecord = <T extends { [key in keyof T]: ErrorObject<key> }>(
  errorObject: T,
): T & Record<string, ErrorObject<keyof T>> => errorObject;

export const isErrorObject = (object: object | string): object is ErrorObject<string> => {
  return typeof object === 'object' && object !== null && 'errorCode' in object && 'message' in object;
};

export const ERROR_CODE = dynamicRecord({
  /**
   * 공통
   */
  INVALID_DATA: { errorCode: 'INVALID_DATA', message: '입력값이 올바르지 않습니다.', status: HttpStatus.BAD_REQUEST },
  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: '서버에 오류가 발생했습니다.',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  /**
   * 유저
   */
  USER_NOT_FOUND: {
    errorCode: 'USER_NOT_FOUND',
    message: '존재하지 않는 고객입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  USER_ALREADY_EXISTS: {
    errorCode: 'USER_ALREADY_EXISTS',
    message: '이미 가입된 고객입니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  USER_WITHDRAWAL: {
    errorCode: 'USER_WITHDRAWAL',
    message: '탈퇴한 고객입니다.',
    status: HttpStatus.FORBIDDEN,
  },

  /**
   * 인증
   */
  VERIFICATION_NOT_FOUND: {
    errorCode: 'VERIFICATION_NOT_FOUND',
    message: '존재하지 않는 인증정보입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  VERIFICATION_EXCEED_MAXIMUM_COUNT: {
    errorCode: 'VERIFICATION_EXCEED_MAXIMUM_COUNT',
    message: '인증시도 횟수를 초과했습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  VERIFICATION_EXPIRED: {
    errorCode: 'VERIFICATION_EXPIRED',
    message: '인증시간이 만료되었습니다.',
    status: HttpStatus.BAD_REQUEST,
  },
  VERIFICATION_ALREADY_VERIFIED: {
    errorCode: 'VERIFICATION_ALREADY_VERIFIED',
    message: '이미 인증된 정보입니다.',
    status: HttpStatus.BAD_REQUEST,
  },

  /**
   * 약관
   */
  TERMS_OF_SERVICE_NOT_FOUND: {
    errorCode: 'TERMS_OF_SERVICE_NOT_FOUND',
    message: '존재하지 않는 약관입니다.',
    status: HttpStatus.NOT_FOUND,
  },
  TERMS_OF_SERVICE_ALREADY_AGREE: {
    errorCode: 'TERMS_OF_SERVICE_ALREADY_AGREE',
    message: '이미 동의한 약관 정보입니다.',
    status: HttpStatus.BAD_REQUEST,
  },

  /**
   * 앨범
   */
  SHARE_ALBUM_NOT_FOUND: {
    errorCode: 'SHARE_ALBUM_NOT_FOUND',
    message: '앨범을 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  SHARE_ALBUM_INVITE_CODE_NOT_FOUND: {
    errorCode: 'SHARE_ALBUM_INVITE_CODE_NOT_FOUND',
    message: '초대코드를 찾을 수 없습니다.',
    status: HttpStatus.NOT_FOUND,
  },
  SHARE_ALBUM_MEMBER_ALREADY_JOINED: {
    errorCode: 'SHARE_ALBUM_MEMBER_ALREADY_JOINED',
    message: '이미 가입된 멤버입니다.',
    status: HttpStatus.NOT_FOUND,
  },

  /**
   * 앨범 권한
   */
  SHARE_ALBUM_INSUFFICIENT_PERMISSION: {
    errorCode: 'SHARE_ALBUM_INSUFFICIENT_PERMISSION',
    message: '앨범에 접근할 권한이 부족합니다.',
    status: HttpStatus.FORBIDDEN,
  },
});

// 스웨거 Exception Description을 위한 데코레이터
export const GenerateSwaggerDocumentByErrorCode = (errorList: ErrorObject<string>[]) => {
  const badRequest = errorList
    .filter((error) => error.status === HttpStatus.BAD_REQUEST)
    .map((error) => `${error.errorCode}: ${error.message}`)
    .join('</br>');
  const notFound = errorList
    .filter((error) => error.status === HttpStatus.NOT_FOUND)
    .map((error) => `${error.errorCode}: ${error.message}`)
    .join('</br>');
  const forbidden = errorList
    .filter((error) => error.status === HttpStatus.FORBIDDEN)
    .map((error) => `${error.errorCode}: ${error.message}`)
    .join('</br>');
  const internalServerError = errorList
    .filter((error) => error.status === HttpStatus.INTERNAL_SERVER_ERROR)
    .map((error) => `${error.errorCode}: ${error.message}`)
    .join('</br>');

  return applyDecorators(
    ApiBadRequestResponse({ description: badRequest }),
    ApiForbiddenResponse({ description: forbidden }),
    ApiNotFoundResponse({ description: notFound }),
    ApiInternalServerErrorResponse({ description: internalServerError }),
  );
};
