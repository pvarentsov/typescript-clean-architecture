import { Exclude, Expose, plainToClass } from 'class-transformer';
import { UseCaseValidatableAdapter } from '../../../../core/common/adapter/usecase/UseCaseValidatableAdapter';
import { IsUUID } from 'class-validator';
import { GetUserPort } from '../../../../core/domain/user/port/usecase/GetUserPort';

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
