import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { AuthController } from '@application/api/http-rest/controller/AuthController';
import { UserModule } from '@application/di/UserModule';
import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/HttpLocalStrategy';
import { HttpJwtStrategy } from '@application/api/http-rest/auth/passport/HttpJwtStrategy';

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

