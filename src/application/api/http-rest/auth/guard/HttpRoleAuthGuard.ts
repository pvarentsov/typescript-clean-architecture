import { HttpRequestWithUser } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class HttpRoleAuthGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.get<UserRole[]>('roles', context.getHandler()) || [];
    const request: HttpRequestWithUser = context.switchToHttp().getRequest();
    
    const canActivate: boolean = roles.length > 0
      ? roles.includes(request.user.role)
      : true;
    
    if (!canActivate) {
      throw Exception.new({code: Code.ACCESS_DENIED_ERROR});
    }
    
    return canActivate;
  }
  
}
