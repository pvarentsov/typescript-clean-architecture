import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelMedia } from './HttpRestApiModelMedia';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';

export class HttpRestApiResponseMediaList extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelMedia, isArray: true})
  public data: HttpRestApiModelMedia[];
}
