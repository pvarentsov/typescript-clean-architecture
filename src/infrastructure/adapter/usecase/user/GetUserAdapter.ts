import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetUserAdapter extends UseCaseValidatableAdapter implements GetUserPort {
  
  @Expose()
  @IsUUID()
  public userId: string;
  
  public static async new(payload: GetUserPort): Promise<GetUserAdapter> {
    const adapter: GetUserAdapter = plainToClass(GetUserAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
