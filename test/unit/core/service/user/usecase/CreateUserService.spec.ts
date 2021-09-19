import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';
import { CreateUserUseCase } from '@core/domain/user/usecase/CreateUserUseCase';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { CreateUserService } from '@core/service/user/usecase/CreateUserService';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('CreateUserService', () => {
  let createUserService: CreateUserUseCase;
  let userRepository: UserRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserUseCase,
          useFactory: (userRepository) => new CreateUserService(userRepository),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useClass: TypeOrmUserRepositoryAdapter
        },
      ]
    }).compile();
  
    createUserService = module.get<CreateUserUseCase>(UserDITokens.CreateUserUseCase);
    userRepository    = module.get<UserRepositoryPort>(UserDITokens.UserRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it creates user', async () => {
      const mockUserId: string = v4();
    
      jest.spyOn(userRepository, 'countUsers').mockImplementation(async () => 0);
      jest.spyOn(userRepository, 'addUser').mockImplementation(async () => {
        return {id: mockUserId};
      });
    
      jest.spyOn(userRepository, 'addUser').mockClear();
  
      const createUserPort: CreateUserPort = createPort();
    
      const expectedUser: User = await User.new({
        id       : mockUserId,
        firstName: createUserPort.firstName,
        lastName : createUserPort.lastName,
        email    : createUserPort.email,
        role     : createUserPort.role,
        password : createUserPort.password,
      });
    
      const expectedUserUseCaseDto: UserUseCaseDto = await UserUseCaseDto.newFromUser(expectedUser);
    
      const resultUserUseCaseDto: UserUseCaseDto = await createUserService.execute(createUserPort);
      Reflect.set(resultUserUseCaseDto, 'id', expectedUserUseCaseDto.id);
    
      const resultAddedUser: User = jest.spyOn(userRepository, 'addUser').mock.calls[0][0];
      Reflect.set(resultAddedUser, 'id', expectedUser.getId());
      Reflect.set(resultAddedUser, 'createdAt', expectedUser.getCreatedAt());
      Reflect.set(resultAddedUser, 'password', expectedUser.getPassword());
    
      expect(resultUserUseCaseDto).toEqual(expectedUserUseCaseDto);
      expect(resultAddedUser).toEqual(expectedUser);
    });
  
    test('When user already exists, expect it throws Exception', async () => {
      jest.spyOn(userRepository, 'countUsers').mockImplementation(async () => 1);
  
      expect.hasAssertions();
      
      try {
        const createUserPort: CreateUserPort = createPort();
        await createUserService.execute(createUserPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_ALREADY_EXISTS_ERROR.code);
      }
    });
  
  });
  
});

function createPort(): CreateUserPort {
  return {
    firstName: v4(),
    lastName : v4(),
    email    : 'author@email.com',
    role     : UserRole.AUTHOR,
    password : v4(),
  };
}
