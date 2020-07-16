import { Exclude, Expose, plainToClass } from 'class-transformer';
import { User } from '../../entity/User';
import { UserRole } from '../../../../common/enums/UserEnums';

@Exclude()
export class UserUseCaseDto {

  @Expose()
  public id: string;
  
  @Expose()
  public firstName: string;
  
  @Expose()
  public lastName: string;
  
  @Expose()
  public email: string;
  
  @Expose()
  public role: UserRole;
  
  public static newFromUser(user: User): UserUseCaseDto {
    return plainToClass(UserUseCaseDto, user);
  }
  
  public static newListFromUsers(users: User[]): UserUseCaseDto[] {
    return users.map(user => this.newFromUser(user));
  }
  
}
