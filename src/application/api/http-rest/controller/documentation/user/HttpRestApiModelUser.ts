import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../../../core/common/enums/UserEnums';

export class HttpRestApiModelUser {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: 'string'})
  public firstName: string;
  
  @ApiProperty({type: 'string'})
  public lastName: string;
  
  @ApiProperty({type: 'string'})
  public email: string;
  
  @ApiProperty({type: 'string'})
  public role: UserRole;
  
}
