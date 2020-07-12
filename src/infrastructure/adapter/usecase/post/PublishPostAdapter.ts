import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/domain/.shared/adapter/usecase/UseCaseValidatableAdapter';
import { IsUUID } from 'class-validator';
import { PublishPostPort } from '../../../../core/domain/post/port/usecase/PublishPostPort';

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
  
  public static async newFromRawPayload(rawPayload: Record<string, unknown>): Promise<PublishPostAdapter> {
    const adapter: PublishPostAdapter = plainToClass(PublishPostAdapter, rawPayload);
    await adapter.validate();
    
    return adapter;
  }
  
}
