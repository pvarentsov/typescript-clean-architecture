import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetPostPort } from '@core/domain/post/port/usecase/GetPostPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetPostAdapter extends UseCaseValidatableAdapter implements GetPostPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public postId: string;
  
  public static async new(payload: GetPostPort): Promise<GetPostAdapter> {
    const adapter: GetPostAdapter = plainToClass(GetPostAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
