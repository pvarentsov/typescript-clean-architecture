import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelEditMediaBody {
  @ApiProperty({type: 'string', required: false})
  public name: string;
}
