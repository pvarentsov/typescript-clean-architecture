import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '@core/common/enums/UserEnums';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { HttpRoleAuthGuard } from '@application/api/http-rest/auth/guard/HttpRoleAuthGuard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpAuth = (...roles: UserRole[]): (...args: any) => void => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(HttpJwtAuthGuard, HttpRoleAuthGuard)
  );
};
