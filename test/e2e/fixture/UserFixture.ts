import { UserRole } from '@core/common/enums/UserEnums';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

export class UserFixture {
  
  constructor(
    private readonly testingModule: TestingModule
  ) {}
  
  public async insertUser(payload: {role: UserRole, email?: string, password?: string}): Promise<User> {
    const userRepository: UserRepositoryPort = this.testingModule.get(UserDITokens.UserRepository);
    
    const userId: string = v4();
    const userFirstName: string = `${payload.role}_${userId}`;
    const userEmail: string = `${userFirstName}@email.com`;
    
    const user: User = await User.new({
      id       : userId,
      firstName: userFirstName,
      lastName : 'LastName',
      email    : payload.email || userEmail,
      role     : payload.role,
      password : payload.password || v4()
    });
    
    await userRepository.addUser(user);
    
    return user;
  }
  
  public static new(testingModule: TestingModule): UserFixture {
    return new UserFixture(testingModule);
  }
  
}