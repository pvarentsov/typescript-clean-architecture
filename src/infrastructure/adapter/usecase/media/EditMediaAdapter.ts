import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { EditMediaPort } from '@core/domain/media/port/usecase/EditMediaPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class EditMediaAdapter extends UseCaseValidatableAdapter implements EditMediaPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public mediaId: string;
  
  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;
  
  public static async new(payload: EditMediaPort): Promise<EditMediaAdapter> {
    const adapter: EditMediaAdapter = plainToClass(EditMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
