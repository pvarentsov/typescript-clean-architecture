import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelGetPostListQuery {
  @ApiProperty({type: 'string', required: false})
  public authorId: string;
}
