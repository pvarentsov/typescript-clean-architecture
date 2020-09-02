import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class EditPostAdapter extends UseCaseValidatableAdapter implements EditPostPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public postId: string;
  
  @Expose()
  @IsOptional()
  @IsString()
  public title?: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  public imageId?: string;
  
  @Expose()
  @IsOptional()
  @IsString()
  public content?: string;
  
  public static async new(payload: EditPostPort): Promise<EditPostAdapter> {
    const adapter: EditPostAdapter = plainToClass(EditPostAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
