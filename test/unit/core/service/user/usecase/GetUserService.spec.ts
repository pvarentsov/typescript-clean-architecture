import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';
import { GetUserService } from '@core/service/user/usecase/GetUserService';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

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
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
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
