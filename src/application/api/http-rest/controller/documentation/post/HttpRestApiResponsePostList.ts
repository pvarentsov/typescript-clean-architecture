import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelPost } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPost';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponsePostList extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelPost, isArray: true})
  public data: HttpRestApiModelPost[];
}
