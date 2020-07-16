import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpAuthService } from '../HttpAuthService';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Nullable } from '../../../../../core/common/type/CommonTypes';
import { HttpUser } from '../type/AuthTypes';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }
  
  public async validate(username: string, password: string): Promise<HttpUser> {
    const user: Nullable<HttpUser> = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user;
  }

}


