import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions() {
        const options = this.configService.get('typeorm');

        if (!options) throw new Error('Typeorm config not found');

        options.username ??= this.configService.get('POSTGRES_USERNAME');
        options.password ??= this.configService.get('POSTGRES_PASSWORD');
        options.database ??= this.configService.get('POSTGRES_DATABASE');
        options.port ??= this.configService.get('POSTGRES_PORT');
        options.host ??= this.configService.get('POSTGRES_HOST');

        return options as TypeOrmModuleOptions;
    }
}
