import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetMediaPort } from '@core/domain/media/port/usecase/GetMediaPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetMediaAdapter extends UseCaseValidatableAdapter implements GetMediaPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public mediaId: string;
  
  public static async new(payload: GetMediaPort): Promise<GetMediaAdapter> {
    const adapter: GetMediaAdapter = plainToClass(GetMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
