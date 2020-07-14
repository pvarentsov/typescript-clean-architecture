import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/common/adapter/usecase/UseCaseValidatableAdapter';
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
  public ownerId?: string;
  
  public static async new(payload: GetPostListPort): Promise<GetPostListAdapter> {
    const adapter: GetPostListAdapter = plainToClass(GetPostListAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
