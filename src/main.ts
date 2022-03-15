import { NestFactory } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from 'package.json';

import { AppModule as CommonModule } from '../src/common/app.module';

@Module({
    imports: [CommonModule],
    controllers: [],
    providers: []
})
class AppModule {}

(async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true }, disableErrorMessages: false })
    );

    const config = new DocumentBuilder().setTitle('boilerplate').setDescription('The boilerplate API description').setVersion(version).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3001);
})();
