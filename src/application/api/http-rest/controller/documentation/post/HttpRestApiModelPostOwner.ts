import { UserRole } from '@core/common/enums/UserEnums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelPostOwner {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: 'string'})
  public name: string;
  
  @ApiProperty({enum: UserRole})
  public role: UserRole;
  
}
