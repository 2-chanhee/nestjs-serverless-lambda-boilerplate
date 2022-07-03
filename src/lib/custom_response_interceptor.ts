import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

export interface Response<T> {
    code: number;
    data?: T;
}

@Injectable()
export class CustomResponseInterCeptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(_: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(map(this.transform));
    }

    transform(data: T): Response<T> {
        return {
            code: HttpStatus.OK,
            data: data
        };
    }
}
