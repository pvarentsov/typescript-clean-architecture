import { Entity } from '../../../common/entity/Entity';
import { IsDate, IsEnum, IsInstance, IsOptional, IsString, IsUUID } from 'class-validator';
import { RemovableEntity } from '../../../common/entity/RemovableEntity';
import { Nullable } from '../../../common/type/CommonTypes';
import { v4 } from 'uuid';
import { MediaType } from '../../../common/enums/MediaEnums';
import { CreateMediaEntityPayload } from './type/CreateMediaEntityPayload';
import { EditMediaEntityPayload } from './type/EditMediaEntityPayload';
import { FileMetadata } from '../value-object/FileMetadata';

export class Media extends Entity<string> implements RemovableEntity {
  
  @IsUUID()
  private readonly ownerId: string;
  
  @IsString()
  private name: string;
  
  @IsEnum(MediaType)
  private readonly type: MediaType;
  
  @IsInstance(FileMetadata)
  private metadata: FileMetadata;
  
  @IsDate()
  private readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  private editedAt: Nullable<Date>;
  
  @IsOptional()
  @IsDate()
  private removedAt: Nullable<Date>;
  
  constructor(payload: CreateMediaEntityPayload) {
    super();
  
    this.ownerId   = payload.ownerId;
    this.name      = payload.name;
    this.type      = payload.type;
    this.metadata  = payload.metadata;
    
    this.id        = payload.id || v4();
    this.createdAt = payload.createdAt || new Date();
    this.editedAt  = payload.editedAt || null;
    this.removedAt = payload.removedAt || null;
  }
  
  public getOwnerId(): string {
    return this.ownerId;
  }
  
  public getName(): string {
    return this.name;
  }
  
  public getType(): MediaType {
    return this.type;
  }
  
  public getMetadata(): FileMetadata {
    return this.metadata;
  }
  
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  
  public getEditedAt(): Nullable<Date> {
    return this.editedAt;
  }
  
  public getRemovedAt(): Nullable<Date> {
    return this.removedAt;
  }
  
  public async edit(payload: EditMediaEntityPayload): Promise<void> {
    const currentDate: Date = new Date();
  
    if (payload.name) {
      this.name = payload.name;
      this.editedAt = currentDate;
    }
    if (payload.metadata) {
      this.metadata = payload.metadata;
      this.editedAt = currentDate;
    }
    
    await this.validate();
  }
  
  public async remove(): Promise<void> {
    this.removedAt = new Date();
    await this.validate();
  }
  
  public static async new(payload: CreateMediaEntityPayload): Promise<Media> {
    const media: Media = new Media(payload);
    await media.validate();
    
    return media;
  }
  
}
