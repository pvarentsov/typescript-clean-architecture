import { UserController } from '@application/api/http-rest/controller/UserController';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { HandleGetUserPreviewQueryService } from '@core/service/user/handler/HandleGetUserPreviewQueryService';
import { CreateUserService } from '@core/service/user/usecase/CreateUserService';
import { GetUserService } from '@core/service/user/usecase/GetUserService';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { NestWrapperGetUserPreviewQueryHandler } from '@infrastructure/handler/user/NestWrapperGetUserPreviewQueryHandler';
import { Module, Provider } from '@nestjs/common';
import { Connection } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide   : UserDITokens.UserRepository,
    useFactory: connection => connection.getCustomRepository(TypeOrmUserRepositoryAdapter),
    inject    : [Connection]
  }
];

const useCaseProviders: Provider[] = [
  {
    provide   : UserDITokens.CreateUserUseCase,
    useFactory: (userRepository) => new CreateUserService(userRepository),
    inject    : [UserDITokens.UserRepository]
  },
  {
    provide   : UserDITokens.GetUserUseCase,
    useFactory: (userRepository) => new GetUserService(userRepository),
    inject    : [UserDITokens.UserRepository]
  },
];

const handlerProviders: Provider[] = [
  NestWrapperGetUserPreviewQueryHandler,
  {
    provide   : UserDITokens.GetUserPreviewQueryHandler,
    useFactory: (userRepository) => new HandleGetUserPreviewQueryService(userRepository),
    inject    : [UserDITokens.UserRepository]
  }
];

@Module({
  controllers: [
    UserController
  ],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...handlerProviders,
  ],
  exports: [
    UserDITokens.UserRepository
  ]
})
export class UserModule {}
