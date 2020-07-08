import { Entity } from '../../.shared/entity/Entity';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { CreatePostEntityPayload } from '../port/entity/CreatePostEntityPayload';
import { EditPostEntityPayload } from '../port/entity/EditPostEntityPayload';
import { RemovableEntity } from '../../.shared/entity/RemovableEntity';
import { Nullable } from '../../.shared/type/CommonTypes';
import { PostStatus } from '../../.shared/enum/PostEnums';
import { v4 } from 'uuid';

@Exclude()
export class Post extends Entity<string> implements RemovableEntity {
  
  @Expose()
  @IsUUID()
  private readonly authorId: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private imageId: Nullable<string>;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private content: Nullable<string>;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private status: PostStatus;
  
  @Expose()
  @IsDate()
  private readonly createdAt: Date;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private editedAt: Nullable<Date>;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private publishedAt: Nullable<Date>;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private removedAt: Nullable<Date>;
  
  constructor(payload?: CreatePostEntityPayload) {
    super();
    
    if (payload) {
      this.authorId = payload.authorId;
      this.imageId = payload.imageId;
      this.content = payload.content;
    }
    
    this.id = v4();
    this.status = PostStatus.DRAFT;
    this.createdAt = new Date();
    
    this.editedAt = null;
    this.publishedAt = null;
    this.removedAt = null;
  }
  
  public getAuthorId(): string {
    return this.authorId;
  }
  
  public getImageId(): Nullable<string> {
    return this.imageId;
  }
  
  public get getContent(): Nullable<string> {
    return this.content;
  }
  
  public get getStatus(): string {
    return this.status;
  }
  
  public get getCreatedAt(): Date {
    return this.createdAt;
  }
  
  public get getEditedAt(): Nullable<Date> {
    return this.editedAt;
  }
  
  public get getPublishedAt(): Nullable<Date> {
    return this.publishedAt;
  }
  
  public get getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }
  
  public async edit(payload: EditPostEntityPayload): Promise<void> {
    const currentDate: Date = new Date();
    
    if (typeof payload.imageId !== 'undefined') {
      this.imageId = payload.imageId;
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
  
  public async draft(): Promise<void>  {
    this.status = PostStatus.DRAFT;
    this.editedAt = new Date();
    
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
