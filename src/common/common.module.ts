import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import configuration from '../configuration';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
    imports: [
        /**
         * validation check
         * local: .env file (repo에는 commit 안함)
         * 배포 시: git action에서 .env file 생성하여 사용
         */
        ConfigModule.forRoot({
            envFilePath: '.env',
            validationSchema: Joi.object({
                MYSQL_HOST: Joi.string().required(),
                MYSQL_USERNAME: Joi.string().required(),
                MYSQL_PASSWORD: Joi.string().required(),
                MYSQL_DATABASE: Joi.string().required()
            }),
            load: [configuration]
        })
    ],
    controllers: [CommonController],
    providers: [CommonService]
})
export class CommonModule {}
