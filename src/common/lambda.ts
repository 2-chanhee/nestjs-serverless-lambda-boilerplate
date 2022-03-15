import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import ServerlessExpress from '@vendia/serverless-express';
import express from 'express';
import 'source-map-support/register';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';

import { AppModule } from './app.module';

let cachedServer;

export const bootstrapServer = async (module: any) => {
    if (!cachedServer) {
        const expressApp = express();

        console.log('common stage', process.env.stage);

        const app = await NestFactory.create(module, new ExpressAdapter(expressApp));
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true }
            })
        );
        app.enableCors({
            origin: '*',
            allowedHeaders: '*'
        });

        await app.init();

        cachedServer = ServerlessExpress({ app: expressApp });
    }

    return cachedServer;
};

export const handler: APIGatewayProxyHandler = async (event: any, context: Context, callback: any) => {
    const server = await bootstrapServer(AppModule);

    return server(event, context, callback);
};
