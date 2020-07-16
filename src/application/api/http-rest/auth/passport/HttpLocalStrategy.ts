import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpAuthService } from '../HttpAuthService';
import { Injectable } from '@nestjs/common';
import { Nullable } from '../../../../../core/common/type/CommonTypes';
import { HttpUserPayload } from '../type/HttpAuthTypes';
import { Exception } from '../../../../../core/common/exception/Exception';
import { Code } from '../../../../../core/common/code/Code';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
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


