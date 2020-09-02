import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelUser } from '@application/api/http-rest/controller/documentation/user/HttpRestApiModelUser';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseUser extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelUser})
  public data: HttpRestApiModelUser;
}
