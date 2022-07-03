import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import ServerlessExpress from '@vendia/serverless-express';
import { LoggingInterceptor } from '@algoan/nestjs-logging-interceptor';
import { Logger } from 'nestjs-pino';
import express from 'express';

import { CustomExceptionHandler } from './custom_exception_handler';
import { CustomResponseInterCeptor } from './custom_response_interceptor';

let cachedServer;

export const bootstrapServer = async (module: any) => {
    if (!cachedServer) {
        const expressApp = express();
        const isProd = process.env.stage === 'prod';

        const app = await NestFactory.create(module, new ExpressAdapter(expressApp));

        app.useLogger(app.get(Logger));
        app.useGlobalInterceptors(new CustomResponseInterCeptor(), new LoggingInterceptor());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                disableErrorMessages: false
            })
        );
        app.useGlobalFilters(new CustomExceptionHandler());
        app.enableCors({
            origin: isProd ? /todo\.co\.kr$/ : '*',
            allowedHeaders: '*'
        });

        await app.init();

        cachedServer = ServerlessExpress({
            app: expressApp,
            // allowed api gateway content-type
            binarySettings: {
                contentTypes: ['multipart/form-data']
            }
        });
    }

    return cachedServer;
};
