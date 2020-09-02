import { HttpRestApiModelLoggedInUser } from '@application/api/http-rest/controller/documentation/auth/HttpRestApiModelLoggedInUser';
import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseLoggedInUser extends HttpRestApiResponse {
  
  @ApiProperty({type: HttpRestApiModelLoggedInUser})
  public data: HttpRestApiModelLoggedInUser;
  
}
