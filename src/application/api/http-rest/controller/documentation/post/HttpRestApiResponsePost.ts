import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelPost } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPost';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponsePost extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelPost})
  public data: HttpRestApiModelPost;
}
