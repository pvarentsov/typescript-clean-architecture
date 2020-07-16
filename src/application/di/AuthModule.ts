import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpAuthService } from '../api/http-rest/auth/HttpAuthService';
import { UserModule } from './UserModule';
import { HttpLocalStrategy } from '../api/http-rest/auth/passport/HttpLocalStrategy';
import { HttpJwtStrategy } from '../api/http-rest/auth/passport/HttpJwtStrategy';
import { AuthController } from '../api/http-rest/controller/AuthController';

@Module({
  controllers: [
    AuthController
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '5m' },
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

