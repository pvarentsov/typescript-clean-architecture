import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelMedia } from '@application/api/http-rest/controller/documentation/media/HttpRestApiModelMedia';

export class HttpRestApiResponseMediaList extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelMedia, isArray: true})
  public data: HttpRestApiModelMedia[];
}
