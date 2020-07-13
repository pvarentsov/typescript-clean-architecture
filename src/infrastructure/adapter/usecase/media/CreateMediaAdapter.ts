import { IsDefined, IsEnum, IsString, IsUUID } from 'class-validator';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/shared/adapter/usecase/UseCaseValidatableAdapter';
import { CreateMediaPort } from '../../../../core/domain/media/port/usecase/CreateMediaPort';
import { MediaType } from '../../../../core/shared/enums/MediaEnums';
import { Readable } from 'stream';

@Exclude()
export class CreateMediaAdapter extends UseCaseValidatableAdapter implements CreateMediaPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsString()
  public name: string;
  
  @Expose()
  @IsEnum(MediaType)
  public type: MediaType;
  
  @Expose()
  @IsDefined()
  public file: Buffer|Readable;
  
  public static async new(payload: CreateMediaPort): Promise<CreateMediaAdapter> {
    const adapter: CreateMediaAdapter = plainToClass(CreateMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
