import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/shared/adapter/usecase/UseCaseValidatableAdapter';
import { IsUUID } from 'class-validator';
import { GetPostPort } from '../../../../core/domain/post/port/usecase/GetPostPort';

@Exclude()
export class GetPostAdapter extends UseCaseValidatableAdapter implements GetPostPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsUUID()
  public postId: string;
  
  public static async new(payload: GetPostAdapter): Promise<GetPostAdapter> {
    const adapter: GetPostAdapter = plainToClass(GetPostAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
  public static async newFromRawPayload(rawPayload: Record<string, unknown>): Promise<GetPostAdapter> {
    const adapter: GetPostAdapter = plainToClass(GetPostAdapter, rawPayload);
    await adapter.validate();
    
    return adapter;
  }
  
}
