import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

import { CommonModule } from './../src/common/common.module';
import { CommonController } from '../src/common/common.controller';
import { CommonService } from '../src/common/common.service';
import configuration from '../src/configuration';

describe('CommonController (e2e)', () => {
    let app: INestApplication;
    let commonService: CommonService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [configuration],
                    cache: true,
                    isGlobal: true
                }),
                // TypeOrmModule.forRoot({
                //     type: 'sqlite',
                //     database: ':memory:',
                //     autoLoadEntities: true,
                //     synchronize: true,
                //     logging: false
                // }),
                CommonModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        // app.useGlobalPipes(
        //     new ValidationPipe({
        //         whitelist: true,
        //         transform: true,
        //         transformOptions: { enableImplicitConversion: true },
        //         disableErrorMessages: false
        //     })
        // );
        await app.init();

        commonService = app.get(CommonService);
    });

    it('/common/status (GET)', () => {
        return request(app.getHttpServer()).get('/common/status').expect(200).expect(commonService.getServerStatus());
    });
});
