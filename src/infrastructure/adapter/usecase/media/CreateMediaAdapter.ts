import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { MediaType } from '@core/common/enums/MediaEnums';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsDefined, IsEnum, IsString, IsUUID } from 'class-validator';

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
  public file: Buffer|NodeJS.ReadableStream;
  
  public static async new(payload: CreateMediaPort): Promise<CreateMediaAdapter> {
    const adapter: CreateMediaAdapter = plainToClass(CreateMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
