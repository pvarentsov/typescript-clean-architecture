import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiModelPost } from './HttpRestApiModelPost';
import { HttpRestApiResponse } from '../common/HttpRestApiResponse';

export class HttpRestApiResponsePost extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelPost})
  public data: HttpRestApiModelPost;
}
