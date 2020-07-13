import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/shared/adapter/usecase/UseCaseValidatableAdapter';
import { IsUUID } from 'class-validator';
import { RemoveMediaPort } from '../../../../core/domain/media/port/usecase/RemoveMediaPort';

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
