import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Optional } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/user/entity/User';
import { Exception } from '@core/common/exception/Exception';
import { Code } from '@core/common/code/Code';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { HttpAuthService } from '@application/api/http-rest/auth/HttpAuthService';
import { HttpJwtPayload, HttpUserPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private authService: HttpAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(ApiServerConfig.ACCESS_TOKEN_HEADER),
      ignoreExpiration: false,
      secretOrKey: ApiServerConfig.ACCESS_TOKEN_SECRET,
    });
  }
  
  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user: Optional<User> = await this.authService.getUser({id: payload.id});
    if (!user) {
      throw Exception.new({code: Code.UNAUTHORIZED_ERROR});
    }
  
    return {id: user.getId(), email: user.getEmail(), role: user.getRole()};
  }
  
}


