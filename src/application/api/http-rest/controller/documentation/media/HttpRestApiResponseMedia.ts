import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelMedia } from './HttpRestApiModelMedia';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';

export class HttpRestApiResponseMedia extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelMedia})
  public data: HttpRestApiModelMedia;
}
