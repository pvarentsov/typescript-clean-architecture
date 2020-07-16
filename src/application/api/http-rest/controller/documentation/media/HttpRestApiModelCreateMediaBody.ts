import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelCreateMediaBody {
  @ApiProperty({type: 'string', format: 'binary'})
  public file: string;
}
