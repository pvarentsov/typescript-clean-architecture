import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelPost } from './HttpRestApiModelPost';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';

export class HttpRestApiResponsePostList extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelPost, isArray: true})
  public data: HttpRestApiModelPost[];
}
