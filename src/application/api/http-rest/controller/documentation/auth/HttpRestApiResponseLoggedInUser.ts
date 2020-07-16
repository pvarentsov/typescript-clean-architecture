import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';
import { HttpRestApiModelLoggedInUser } from './HttpRestApiModelLoggedInUser';

export class HttpRestApiResponseLoggedInUser extends HttpRestApiResponse {
  
  @ApiProperty({type: HttpRestApiModelLoggedInUser})
  public data: HttpRestApiModelLoggedInUser;
  
}
