import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelLogInBody {
  
  @ApiProperty({type: 'string'})
  public email: string;
  
  @ApiProperty({type: 'string'})
  public password: string;
}
