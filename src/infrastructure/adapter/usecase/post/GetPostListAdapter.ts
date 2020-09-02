import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { PostStatus } from '@core/common/enums/PostEnums';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

@Exclude()
export class GetPostListAdapter extends UseCaseValidatableAdapter implements GetPostListPort {
  
  @Expose()
  @IsUUID()
  public executorId: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  public ownerId?: string;
  
  @Expose()
  @IsOptional()
  @IsEnum(PostStatus)
  public status?: PostStatus;
  
  public static async new(payload: GetPostListPort): Promise<GetPostListAdapter> {
    const adapter: GetPostListAdapter = plainToClass(GetPostListAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
