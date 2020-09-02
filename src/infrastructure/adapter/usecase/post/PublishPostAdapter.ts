import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class PublishPostAdapter extends UseCaseValidatableAdapter implements PublishPostPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public postId: string;
  
  public static async new(payload: PublishPostPort): Promise<PublishPostAdapter> {
    const adapter: PublishPostAdapter = plainToClass(PublishPostAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
