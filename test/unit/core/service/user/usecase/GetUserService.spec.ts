import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryPort } from '../../../../../../src/core/domain/user/port/persistence/UserRepositoryPort';
import { UserDITokens } from '../../../../../../src/core/domain/user/di/UserDITokens';
import { GetUserService } from '../../../../../../src/core/service/user/usecase/GetUserService';
import { TypeOrmUserRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { User } from '../../../../../../src/core/domain/user/entity/User';
import { v4 } from 'uuid';
import { UserUseCaseDto } from '../../../../../../src/core/domain/user/usecase/dto/UserUseCaseDto';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';
import { GetUserPort } from '../../../../../../src/core/domain/user/port/usecase/GetUserPort';
import { GetUserUseCase } from '../../../../../../src/core/domain/user/usecase/GetUserUseCase';

describe('GetUserService', () => {
  let getUserService: GetUserUseCase;
  let userRepository: UserRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.GetUserUseCase,
          useFactory: (userRepository) => new GetUserService(userRepository),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useClass: TypeOrmUserRepositoryAdapter
        },
      ]
    }).compile();
  
    getUserService = module.get<GetUserUseCase>(UserDITokens.GetUserUseCase);
    userRepository = module.get<UserRepositoryPort>(UserDITokens.UserRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it returns user', async () => {
      const mockUser: User = await createUser();
    
      jest.spyOn(userRepository, 'findUser').mockImplementation(async () => mockUser);
  
      const expectedUserUseCaseDto: UserUseCaseDto = await UserUseCaseDto.newFromUser(mockUser);
  
      const getUserPort: GetUserPort = {userId: mockUser.getId()};
      const resultUserUseCaseDto: UserUseCaseDto = await getUserService.execute(getUserPort);
  
      expect(resultUserUseCaseDto).toEqual(expectedUserUseCaseDto);
    });
  
    test('When user not found, expect it throws Exception', async () => {
      jest.spyOn(userRepository, 'findUser').mockImplementation(async () => undefined);
    
      expect.hasAssertions();
    
      try {
        const getUserPort: GetUserPort = {userId: v4()};
        await getUserService.execute(getUserPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
  });
  
});

async function createUser(): Promise<User> {
  return User.new({
    firstName: v4(),
    lastName : v4(),
    email    : 'author@email.com',
    role     : UserRole.AUTHOR,
    password : v4(),
  });
}
