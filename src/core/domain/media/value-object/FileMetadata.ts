import { Nullable } from '@core/common/type/CommonTypes';
import { ValueObject } from '@core/common/value-object/ValueObject';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/CreateFileMetadataValueObjectPayload';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FileMetadata extends ValueObject {
  
  @IsString()
  public readonly relativePath: string;
  
  @IsOptional()
  @IsNumber()
  public readonly size: Nullable<number>;
  
  @IsOptional()
  @IsString()
  public readonly ext: Nullable<string>;
  
  @IsOptional()
  @IsString()
  public readonly mimetype: Nullable<string>;
  
  constructor(payload: CreateFileMetadataValueObjectPayload) {
    super();
  
    this.relativePath = payload.relativePath;
    this.size         = payload.size || null;
    this.ext          = payload.ext || null;
    this.mimetype     = payload.mimetype || null;
  }
  
  public static async new(payload: CreateFileMetadataValueObjectPayload): Promise<FileMetadata> {
    const fileMetadata: FileMetadata = new FileMetadata(payload);
    await fileMetadata.validate();
    
    return fileMetadata;
  }
  
}
