import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { UserRole } from '@core/common/enums/UserEnums';
import { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsIn, IsString } from 'class-validator';

@Exclude()
export class CreateUserAdapter extends UseCaseValidatableAdapter implements CreateUserPort {
  
  @Expose()
  @IsString()
  public firstName: string;
  
  @Expose()
  @IsString()
  public lastName: string;
  
  @Expose()
  @IsEmail()
  public email: string;
  
  @Expose()
  @IsIn([UserRole.AUTHOR, UserRole.GUEST])
  public role: UserRole;
  
  @Expose()
  @IsString()
  public password: string;
  
  public static async new(payload: CreateUserPort): Promise<CreateUserAdapter> {
    const adapter: CreateUserAdapter = plainToClass(CreateUserAdapter, payload);
    await adapter.validate();
    
    return adapter;
  }
  
}
