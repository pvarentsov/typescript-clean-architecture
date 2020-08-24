import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryPort } from '../../../../../../src/core/domain/user/port/persistence/UserRepositoryPort';
import { UserDITokens } from '../../../../../../src/core/domain/user/di/UserDITokens';
import { TypeOrmUserRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { User } from '../../../../../../src/core/domain/user/entity/User';
import { v4 } from 'uuid';
import { HandleGetUserPreviewQueryService } from '../../../../../../src/core/service/user/handler/HandleGetUserPreviewQueryService';
import { GetUserPreviewQueryHandler } from '../../../../../../src/core/domain/user/handler/GetUserPreviewQueryHandler';
import { GetUserPreviewQueryResult } from '../../../../../../src/core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { GetUserPreviewQuery } from '../../../../../../src/core/common/cqers/query/queries/user/GetUserPreviewQuery';
import { Optional } from '../../../../../../src/core/common/type/CommonTypes';
import { UserRole } from '../../../../../../src/core/common/enums/UserEnums';

describe('HandleGetUserPreviewQueryService', () => {
  let getUserPreviewQueryHandler: GetUserPreviewQueryHandler;
  let userRepository: UserRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.GetUserPreviewQueryHandler,
          useFactory: (userRepository) => new HandleGetUserPreviewQueryService(userRepository),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useClass: TypeOrmUserRepositoryAdapter
        }
      ]
    }).compile();
  
    getUserPreviewQueryHandler = module.get<GetUserPreviewQueryHandler>(UserDITokens.GetUserPreviewQueryHandler);
    userRepository             = module.get<UserRepositoryPort>(UserDITokens.UserRepository);
  });
  
  describe('handle', () => {
  
    test('When user found, expect it returns user preview', async () => {
      const mockUser: User = await createUser();
      
      jest.spyOn(userRepository, 'findUser').mockImplementation(async () => mockUser);
      
      const expectedPreview: GetUserPreviewQueryResult = GetUserPreviewQueryResult.new(
        mockUser.getId(),
        mockUser.getName(),
        mockUser.getRole(),
      );
  
      const getUserPreviewQuery: GetUserPreviewQuery = {by: {id: mockUser.getId()}};
      const resultPreview: Optional<GetUserPreviewQueryResult> = await getUserPreviewQueryHandler.handle(getUserPreviewQuery);
      
      expect(resultPreview).toEqual(expectedPreview);
    });
  
    test('When user not found, expect it returns nothing', async () => {
      jest.spyOn(userRepository, 'findUser').mockImplementation(async () => undefined);
      
      const getUserPreviewQuery: GetUserPreviewQuery = {by: {id: v4()}};
      const resultPreview: Optional<GetUserPreviewQueryResult> = await getUserPreviewQueryHandler.handle(getUserPreviewQuery);
    
      expect(resultPreview).toBeUndefined();
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
