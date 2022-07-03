import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

interface HttpExceptionResponseType {
    message: string;
}

/**
 * httpException, 그 외의 모든 에러를 핸들링하는 클래스
 * httpException과 그 외의 에러를 나눠준다.
 * @Catch() 데코레이터의 파라미터가 없으므로 모든 exception을 catch한다.
 */
@Catch()
export class CustomExceptionHandler extends BaseExceptionFilter {
    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResult = await this.returnCustomException(exception);

        response.json(errorResult);
    }

    async returnCustomException(exception) {
        if (exception instanceof HttpException) {
            const { message } = exception.getResponse() as HttpExceptionResponseType;

            return {
                code: exception.getStatus(),
                message: Array.isArray(message) ? message[0] : message
            };
        }
        // HttpException 외의 error에 대한 처리
        else {
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Please try again later.'
            };
        }
    }
}
