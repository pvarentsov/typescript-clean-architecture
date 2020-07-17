import { Entity } from '../../../common/entity/Entity';
import { IsDate, IsEnum, IsInstance, IsOptional, IsString } from 'class-validator';
import { CreatePostEntityPayload } from './type/CreatePostEntityPayload';
import { EditPostEntityPayload } from './type/EditPostEntityPayload';
import { RemovableEntity } from '../../../common/entity/RemovableEntity';
import { Nullable } from '../../../common/type/CommonTypes';
import { PostStatus } from '../../../common/enums/PostEnums';
import { v4 } from 'uuid';
import { PostOwner } from './PostOwner';
import { PostImage } from './PostImage';

export class Post extends Entity<string> implements RemovableEntity {
  
  @IsInstance(PostOwner)
  private readonly owner: PostOwner;
  
  @IsString()
  private title: string;
  
  @IsOptional()
  @IsInstance(PostImage)
  private image: Nullable<PostImage>;
  
  @IsOptional()
  @IsString()
  private content: Nullable<string>;
  
  @IsOptional()
  @IsEnum(PostStatus)
  private status: PostStatus;

  @IsDate()
  private readonly createdAt: Date;
  
  @IsOptional()
  @IsDate()
  private editedAt: Nullable<Date>;
  
  @IsOptional()
  @IsDate()
  private publishedAt: Nullable<Date>;
  
  @IsOptional()
  @IsDate()
  private removedAt: Nullable<Date>;
  
  constructor(payload: CreatePostEntityPayload) {
    super();
  
    this.owner       = payload.owner;
    this.title       = payload.title;
    this.image       = payload.image || null;
    this.content     = payload.content || null;
  
    this.id          = payload.id || v4();
    this.status      = payload.status || PostStatus.DRAFT;
    this.createdAt   = payload.createdAt || new Date();
    this.editedAt    = payload.editedAt || null;
    this.publishedAt = payload.publishedAt || null;
    this.removedAt   = payload.removedAt || null;
  }
  
  public getOwner(): PostOwner {
    return this.owner;
  }
  
  public getTitle(): string {
    return this.title;
  }
  
  public getImage(): Nullable<PostImage> {
    return this.image;
  }
  
  public getContent(): Nullable<string> {
    return this.content;
  }
  
  public getStatus(): string {
    return this.status;
  }
  
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  
  public getEditedAt(): Nullable<Date> {
    return this.editedAt;
  }
  
  public getPublishedAt(): Nullable<Date> {
    return this.publishedAt;
  }
  
  public getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }
  
  public async edit(payload: EditPostEntityPayload): Promise<void> {
    const currentDate: Date = new Date();
  
    if (payload.title) {
      this.title = payload.title;
      this.editedAt = currentDate;
    }
    if (typeof payload.image !== 'undefined') {
      this.image = payload.image;
      this.editedAt = currentDate;
    }
    if (typeof payload.content !== 'undefined') {
      this.content = payload.content;
      this.editedAt = currentDate;
    }
    
    await this.validate();
  }
  
  public async publish(): Promise<void>  {
    const currentDate: Date = new Date();
    
    this.status = PostStatus.PUBLISHED;
    this.editedAt = currentDate;
    this.publishedAt = currentDate;
  
    await this.validate();
  }
  
  public async remove(): Promise<void> {
    this.removedAt = new Date();
    await this.validate();
  }
  
  public static async new(payload: CreatePostEntityPayload): Promise<Post> {
    const post: Post = new Post(payload);
    await post.validate();
    
    return post;
  }
  
}
