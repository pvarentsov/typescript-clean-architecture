import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/shared/adapter/usecase/UseCaseValidatableAdapter';
import { IsOptional, IsUUID } from 'class-validator';
import { GetPostListPort } from '../../../../core/domain/post/port/usecase/GetPostListPort';

@Exclude()
export class GetPostListAdapter extends UseCaseValidatableAdapter implements GetPostListPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  public authorId?: string;
  
  public static async new(payload: GetPostListPort): Promise<GetPostListAdapter> {
    const adapter: GetPostListAdapter = plainToClass(GetPostListAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
  public static async newFromRawPayload(rawPayload: Record<string, unknown>): Promise<GetPostListAdapter> {
    const adapter: GetPostListAdapter = plainToClass(GetPostListAdapter, rawPayload);
    await adapter.validate();
    
    return adapter;
  }
  
}
