import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../../../../core/common/enums/UserEnums';
import { Reflector } from '@nestjs/core';
import { HttpRequestWithUser } from '../type/HttpAuthTypes';
import { Exception } from '../../../../../core/common/exception/Exception';
import { Code } from '../../../../../core/common/code/Code';

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
