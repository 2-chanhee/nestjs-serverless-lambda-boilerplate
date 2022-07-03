import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from '../configuration';
import { CommonModule } from './common.module';
import { CommonController } from './common.controller';

describe('CommonController', () => {
    let commonController: CommonController;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                CommonModule,
                ConfigModule.forRoot({
                    load: [configuration],
                    cache: true,
                    isGlobal: true
                }),
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: false
                })
            ]
        }).compile();

        commonController = app.get(CommonController);
    });

    describe('GET /common/status', () => {
        it('should return "healthy"', () => {
            const result = commonController.getServerStatus();

            expect(result).toBeDefined();
            expect(result).toEqual('healthy');
        });
    });
});
