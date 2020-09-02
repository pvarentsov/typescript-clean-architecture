import { HttpRestApiModelPostImage } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPostImage';
import { HttpRestApiModelPostOwner } from '@application/api/http-rest/controller/documentation/post/HttpRestApiModelPostOwner';
import { PostStatus } from '@core/common/enums/PostEnums';
import { ApiProperty } from '@nestjs/swagger';

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
