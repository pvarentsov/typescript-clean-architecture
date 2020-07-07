import { DomainEntity } from '../../.shared/entity/DomainEntity';
import { PostStatus } from '../../.shared/entity/post/PostStatus';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { CreatePostEntityPayload } from '../port/entity/CreatePostEntityPayload';
import { EditPostEntityPayload } from '../port/entity/EditPostEntityPayload';
import { RemovableDomainEntity } from '../../.shared/entity/RemovableDomainEntity';
import { v4 } from 'uuid';

@Exclude()
export class Post extends DomainEntity<string> implements RemovableDomainEntity{
  
  @Expose()
  @IsUUID()
  private readonly _authorId: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private _imageId: string|null;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private _content: string|null;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  private _status: PostStatus;
  
  @Expose()
  @IsDate()
  private readonly _createdAt: Date;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private _editedAt: Date|null;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private _publishedAt: Date|null;
  
  @Expose()
  @IsOptional()
  @IsDate()
  private _removedAt: Date|null;
  
  constructor(payload?: CreatePostEntityPayload) {
    super();
    
    if (payload) {
      this._authorId = payload.authorId;
      this._imageId = payload.imageId;
      this._content = payload.content;
    }
    
    this._id = v4();
    this._status = PostStatus.DRAFT;
    this._createdAt = new Date();
    
    this._editedAt = null;
    this._publishedAt = null;
    this._removedAt = null;
  }
  
  public get authorId(): string {
    return this._authorId;
  }
  
  public get imageId(): string|null {
    return this._imageId;
  }
  
  public get content(): string|null {
    return this._content;
  }
  
  public get status(): string {
    return this._status;
  }
  
  public get createdAt(): Date {
    return this._createdAt;
  }
  
  public get editedAt(): Date|null {
    return this._editedAt;
  }
  
  public get publishedAt(): Date|null {
    return this._publishedAt;
  }
  
  public get removedAt(): Date|null {
    return this._removedAt;
  }
  
  public async edit(payload: EditPostEntityPayload): Promise<void> {
    if (typeof payload.imageId !== 'undefined') {
      this._imageId = payload.imageId;
    }
    if (typeof payload.content !== 'undefined') {
      this._content = payload.content;
    }
    
    await this.validate();
  }
  
  public async publish(): Promise<void>  {
    const currentDate: Date = new Date();
    
    this._status = PostStatus.PUBLISHED;
    this._editedAt = currentDate;
    this._publishedAt = currentDate;
  
    await this.validate();
  }
  
  public async draft(): Promise<void>  {
    const currentDate: Date = new Date();
    
    this._status = PostStatus.DRAFT;
    this._editedAt = currentDate;
    
    await this.validate();
  }
  
  public async remove(): Promise<void> {
    this._removedAt = new Date();
    await this.validate();
  }
  
  public static async new(payload: CreatePostEntityPayload): Promise<Post> {
    const post: Post = new Post(payload);
    await post.validate();
    
    return post;
  }
  
}
