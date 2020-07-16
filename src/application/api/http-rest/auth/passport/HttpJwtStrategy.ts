import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpUser, HttpJwtPayload } from '../type/AuthTypes';
import { HttpAuthService } from '../HttpAuthService';
import { Optional } from '../../../../../core/common/type/CommonTypes';
import { User } from '../../../../../core/domain/user/entity/User';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-api-token'),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }
  
  public async validate(payload: HttpJwtPayload): Promise<HttpUser> {
    const user: Optional<User> = await this.authService.getUser({id: payload.id});
    if (!user) {
      throw new UnauthorizedException();
    }
  
    return {id: user.getId(), email: user.getEmail(), role: user.getRole()};
  }
  
}


