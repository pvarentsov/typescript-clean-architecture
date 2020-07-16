import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../../../core/common/enums/UserEnums';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HttpRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

