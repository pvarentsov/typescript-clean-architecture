import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpAuthService } from '../api/http-rest/auth/HttpAuthService';
import { UserModule } from './UserModule';
import { HttpLocalStrategy } from '../api/http-rest/auth/passport/HttpLocalStrategy';
import { HttpJwtStrategy } from '../api/http-rest/auth/passport/HttpJwtStrategy';
import { AuthController } from '../api/http-rest/controller/AuthController';
import { ApiServerConfig } from '../../infrastructure/config/ApiServerConfig';

@Module({
  controllers: [
    AuthController
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ApiServerConfig.ACCESS_TOKEN_SECRET,
      signOptions: {expiresIn: `${ApiServerConfig.ACCESS_TOKEN_TTL_IN_MINUTES}m`},
    }),
    UserModule,
  ],
  providers: [
    HttpAuthService,
    HttpLocalStrategy,
    HttpJwtStrategy
  ],
})
export class AuthModule {}

