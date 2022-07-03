import 'source-map-support/register';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';

import { bootstrapServer } from '../lib/server';
import { AppModule } from './app.module';

export const handler: APIGatewayProxyHandler = async (event: any, context: Context, callback: any) => {
    const server = await bootstrapServer(AppModule);

    return server(event, context, callback);
};
