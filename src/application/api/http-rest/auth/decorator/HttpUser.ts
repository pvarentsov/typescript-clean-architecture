import { HttpRequestWithUser } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpUser: () => any = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
  return request.user;
});

