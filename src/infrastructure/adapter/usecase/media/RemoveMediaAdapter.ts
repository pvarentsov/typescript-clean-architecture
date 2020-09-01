import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { RemoveMediaPort } from '@core/domain/media/port/usecase/RemoveMediaPort';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';

@Exclude()
export class RemoveMediaAdapter extends UseCaseValidatableAdapter implements RemoveMediaPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public mediaId: string;
  
  public static async new(payload: RemoveMediaPort): Promise<RemoveMediaAdapter> {
    const adapter: RemoveMediaAdapter = plainToClass(RemoveMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
