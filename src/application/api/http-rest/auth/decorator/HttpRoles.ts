import { UserRole } from '@core/common/enums/UserEnums';
import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HttpRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

