import { MediaType } from '@core/common/enums/MediaEnums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelMedia {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: 'string'})
  public ownerId: string;
  
  @ApiProperty({type: 'string'})
  public name: string;
  
  @ApiProperty({enum: MediaType})
  public type: MediaType;
  
  @ApiProperty({type: 'string'})
  public url: string;
  
  @ApiProperty({type: 'number'})
  public createdAt: number;
  
  @ApiProperty({type: 'number', required: false})
  public editedAt: number;
  
}
