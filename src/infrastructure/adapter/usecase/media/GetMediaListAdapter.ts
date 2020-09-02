import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetMediaListPort } from '@core/domain/media/port/usecase/GetMediaListPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetMediaListAdapter extends UseCaseValidatableAdapter implements GetMediaListPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  public static async new(payload: GetMediaListPort): Promise<GetMediaListAdapter> {
    const adapter: GetMediaListAdapter = plainToClass(GetMediaListAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
