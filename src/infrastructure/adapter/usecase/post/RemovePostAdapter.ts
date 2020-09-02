import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { RemovePostPort } from '@core/domain/post/port/usecase/RemovePostPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class RemovePostAdapter extends UseCaseValidatableAdapter implements RemovePostPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public postId: string;
  
  public static async new(payload: RemovePostPort): Promise<RemovePostAdapter> {
    const adapter: RemovePostAdapter = plainToClass(RemovePostAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
