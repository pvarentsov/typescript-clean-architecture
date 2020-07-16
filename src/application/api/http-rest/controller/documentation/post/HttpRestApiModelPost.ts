import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostStatus } from '../../../../../../core/common/enums/PostEnums';

export class HttpRestApiModelPost {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: 'string'})
  public ownerId: string;
  
  @Expose()
  public imageId: string;
  
  @Expose()
  public content: string;
  
  @ApiProperty({enum: PostStatus})
  public status: PostStatus;
  
  @ApiProperty({type: 'number'})
  public createdAt: number;
  
  @ApiProperty({type: 'number', required: false})
  public editedAt: number;
  
  @ApiProperty({type: 'number', required: false})
  public publishedAt: number;
  
}
