import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelUser } from './HttpRestApiModelUser';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';

export class HttpRestApiResponseUser extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelUser})
  public data: HttpRestApiModelUser;
}
