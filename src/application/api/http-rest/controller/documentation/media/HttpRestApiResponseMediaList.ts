import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/HttpRestApiResponse';
import { HttpRestApiModelMedia } from '@application/api/http-rest/controller/documentation/media/HttpRestApiModelMedia';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseMediaList extends HttpRestApiResponse {
  @ApiProperty({type: HttpRestApiModelMedia, isArray: true})
  public data: HttpRestApiModelMedia[];
}
