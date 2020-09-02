import { UserRole } from '@core/common/enums/UserEnums';
import { Request } from 'express';

export type HttpUserPayload = {
  id: string,
  email: string,
  role: UserRole,
};

export type HttpRequestWithUser = Request & {user: HttpUserPayload};

export type HttpJwtPayload = {
  id: string,
};

export type HttpLoggedInUser = {
  id: string,
  accessToken: string,
};
