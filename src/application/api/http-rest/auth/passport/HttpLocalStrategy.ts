import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: ApiServerConfig.LOGIN_USERNAME_FIELD,
      passwordField: ApiServerConfig.LOGIN_PASSWORD_FIELD,
    });
  }
  
  public async validate(username: string, password: string): Promise<HttpUserPayload> {
    const user: HttpUserPayload = CoreAssert.notEmpty(
      await this.authService.validateUser(username, password),
      Exception.new({code: Code.WRONG_CREDENTIALS_ERROR})
    );
    
    return user;
  }

}
