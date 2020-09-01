import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelLoggedInUser } from '@application/api/http-rest/controller/documentation/auth/HttpRestApiModelLoggedInUser';

export class HttpRestApiResponseLoggedInUser extends HttpRestApiResponse {
  
  @ApiProperty({type: HttpRestApiModelLoggedInUser})
  public data: HttpRestApiModelLoggedInUser;
  
}
