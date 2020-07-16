import { UserRole } from '../../../../../core/common/enums/UserEnums';
import { Request } from 'express';

export type HttpUser = {
  id: string,
  email: string,
  role: UserRole,
};

export type HttpRequestWithUser = Request & {user: HttpUser};

export type HttpJwtPayload = {
  id: string,
};

export type HttpLoggedInUser = {
  id: string,
  accessToken: string,
};
