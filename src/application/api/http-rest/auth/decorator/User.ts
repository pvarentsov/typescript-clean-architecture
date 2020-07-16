import { createParamDecorator } from '@nestjs/common';
import { HttpRequestWithUser, HttpUser } from '../type/AuthTypes';

export const User: () => unknown = createParamDecorator((data: keyof HttpUser, req: HttpRequestWithUser) => {
  return data ? req.user && req.user[data] : req.user;
});
