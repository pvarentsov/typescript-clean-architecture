import { Entity } from '../../../shared/entity/Entity';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInstance, IsOptional, IsString, IsUUID } from 'class-validator';
import { RemovableEntity } from '../../../shared/entity/RemovableEntity';
import { Nullable } from '../../../shared/type/CommonTypes';
import { v4 } from 'uuid';
import { MediaType } from '../../../shared/enums/MediaEnums';
import { CreateMediaEntityPayload } from './type/CreateMediaEntityPayload';
import { EditMediaEntityPayload } from './type/EditMediaEntityPayload';
import { FileMetadata } from '../value-object/FileMetadata';

@Exclude()
export class Media extends Entity<string> implements RemovableEntity {
  
  @Expose()
  @IsUUID()
  private readonly ownerId: string;
  
  @Expose()
  @IsString()
  private name: string;
  
  @Expose()
  @IsEnum(MediaType)
  private readonly type: MediaType;
  
  @Expose()
  @IsInstance(FileMetadata)
  private metadata: FileMetadata;
  
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
  private removedAt: Nullable<Date>;
  
  constructor(payload?: CreateMediaEntityPayload) {
    super();
    
    if (payload) {
      this.ownerId = payload.ownerId;
      this.name = payload.name;
      this.type = payload.type;
      this.metadata = payload.metadata;
    }
    
    this.id = v4();
    this.createdAt = new Date();
    this.editedAt = null;
    this.removedAt = null;
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
