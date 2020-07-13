import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/shared/adapter/usecase/UseCaseValidatableAdapter';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { EditMediaPort } from '../../../../core/domain/media/port/usecase/EditMediaPort';

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
  
  public static async new(payload: EditMediaAdapter): Promise<EditMediaAdapter> {
    const adapter: EditMediaAdapter = plainToClass(EditMediaAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
