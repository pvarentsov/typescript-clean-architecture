import { UserRole } from '@core/common/enums/UserEnums';
import { CreateUserEntityPayload } from '@core/domain/user/entity/type/CreateUserEntityPayload';
import { User } from '@core/domain/user/entity/User';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { v4 } from 'uuid';

describe('UserUseCaseDto', () => {

  describe('newFromUser', () => {
  
    test('Expect it creates UserUseCaseDto instance with required parameters', async () => {
      const user: User = await createUser();
      const userUseCaseDto: UserUseCaseDto = UserUseCaseDto.newFromUser(user);
  
      expect(userUseCaseDto.id).toBe(user.getId());
      expect(userUseCaseDto.firstName).toBe(user.getFirstName());
      expect(userUseCaseDto.lastName).toBe(user.getLastName());
      expect(userUseCaseDto.email).toBe(user.getEmail());
      expect(userUseCaseDto.role).toBe(user.getRole());
    });
    
  });
  
  describe('newListFromUsers', () => {
    
    test('Expect it creates UserUseCaseDto instances with required parameters', async () => {
      const user: User = await createUser();
      const userUseCaseDtos: UserUseCaseDto[] = UserUseCaseDto.newListFromUsers([user]);
  
      expect(userUseCaseDtos.length).toBe(1);
      expect(userUseCaseDtos[0].id).toBe(user.getId());
      expect(userUseCaseDtos[0].firstName).toBe(user.getFirstName());
      expect(userUseCaseDtos[0].lastName).toBe(user.getLastName());
      expect(userUseCaseDtos[0].email).toBe(user.getEmail());
      expect(userUseCaseDtos[0].role).toBe(user.getRole());
    });
    
  });
  
});

async function createUser(): Promise<User> {
  const createUserEntityPayload: CreateUserEntityPayload = {
    firstName: v4(),
    lastName : v4(),
    email    : 'admin@email.com',
    role     : UserRole.ADMIN,
    password : v4(),
  };
  
  return User.new(createUserEntityPayload);
}
