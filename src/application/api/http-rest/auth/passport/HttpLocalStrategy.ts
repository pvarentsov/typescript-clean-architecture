import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Nullable } from '@core/common/type/CommonTypes';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: ApiServerConfig.LOGIN_USERNAME_FIELD,
      passwordField: ApiServerConfig.LOGIN_PASSWORD_FIELD,
    });
  }
  
  public async validate(username: string, password: string): Promise<HttpUserPayload> {
    const user: Nullable<HttpUserPayload> = await this.authService.validateUser(username, password);
    if (!user) {
      throw Exception.new({code: Code.WRONG_CREDENTIALS_ERROR});
    }
    
    return user;
  }

}


