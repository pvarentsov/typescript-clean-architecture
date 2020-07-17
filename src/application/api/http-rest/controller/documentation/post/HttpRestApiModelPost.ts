import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../../../../../../core/common/enums/PostEnums';
import { HttpRestApiModelPostImage } from './HttpRestApiModelPostImage';
import { HttpRestApiModelPostOwner } from './HttpRestApiModelPostOwner';

export class HttpRestApiModelPost {
  
  @ApiProperty({type: 'string'})
  public id: string;
  
  @ApiProperty({type: HttpRestApiModelPostOwner})
  public owner: HttpRestApiModelPostOwner;
  
  @ApiProperty({type: HttpRestApiModelPostImage})
  public image: HttpRestApiModelPostImage;
  
  @ApiProperty({type: 'string'})
  public title: string;
  
  @ApiProperty({type: 'string'})
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
