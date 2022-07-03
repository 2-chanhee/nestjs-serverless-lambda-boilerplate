import { BadRequestException, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { AuthGuard, PassportModule, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'), // 헤더에 담겨서 넘어올 시 이름
            ignoreExpiration: false, // 만료된 토큰의 사용 여부
            secretOrKey: configService.get<JwtModuleOptions>('jwt')?.secret ?? configService.get('JWT_SECRET') // JWT_SECRET은 git action에서 주입된다.
        });
    }

    // 토큰 검증
    async validate(payload: any) {
        if (!payload.userId || !payload.userLevel) throw new BadRequestException('JWT Token 검증에 실패하였습니다.');

        return {
            userId: payload.userId,
            userLevel: payload.userLevel
        };
    }
}

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    // configuration.ts에 선언된 expiresIn가 존재하지 않는다면 error
    createJwtOptions() {
        const jwtOption = this.configService.get<JwtModuleOptions>('jwt');

        if (!jwtOption) throw new Error('JWT config not found');
        if (!jwtOption.signOptions?.expiresIn) throw new Error('JWT signOptions.expiresIn not found');

        jwtOption.secret ??= this.configService.get('JWT_SECRET');

        return jwtOption;
    }
}

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({ imports: [ConfigModule], inject: [ConfigService], useClass: JwtConfigService })
    ],
    providers: [JwtStrategy],
    exports: [JwtModule]
})
export class JwtAuthModule {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
