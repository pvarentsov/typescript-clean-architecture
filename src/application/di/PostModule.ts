import { PostController } from '@application/api/http-rest/controller/PostController';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { EditPostUseCase } from '@core/domain/post/usecase/EditPostUseCase';
import { PublishPostUseCase } from '@core/domain/post/usecase/PublishPostUseCase';
import { RemovePostUseCase } from '@core/domain/post/usecase/RemovePostUseCase';
import { HandlePostImageRemovedEventService } from '@core/service/post/handler/HandlePostImageRemovedEventService';
import { CreatePostService } from '@core/service/post/usecase/CreatePostService';
import { EditPostService } from '@core/service/post/usecase/EditPostService';
import { GetPostListService } from '@core/service/post/usecase/GetPostListService';
import { GetPostService } from '@core/service/post/usecase/GetPostService';
import { PublishPostService } from '@core/service/post/usecase/PublishPostService';
import { RemovePostService } from '@core/service/post/usecase/RemovePostService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { NestWrapperPostImageRemovedEventHandler } from '@infrastructure/handler/post/NestWrapperPostImageRemovedEventHandler';
import { TransactionalUseCaseWrapper } from '@infrastructure/transaction/TransactionalUseCaseWrapper';
import { Module, Provider } from '@nestjs/common';
import { Connection } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide   : PostDITokens.PostRepository,
    useFactory: connection => connection.getCustomRepository(TypeOrmPostRepositoryAdapter),
    inject    : [Connection]
  }
];

const useCaseProviders: Provider[] = [
  {
    provide   : PostDITokens.CreatePostUseCase,
    useFactory: (postRepository, queryBus) => {
      const service: CreatePostUseCase = new CreatePostService(postRepository, queryBus);
      return new TransactionalUseCaseWrapper(service);
    },
    inject    : [PostDITokens.PostRepository, CoreDITokens.QueryBus]
  },
  {
    provide   : PostDITokens.EditPostUseCase,
    useFactory: (postRepository, queryBus) => {
      const service: EditPostUseCase = new EditPostService(postRepository, queryBus);
      return new TransactionalUseCaseWrapper(service);
    },
    inject    : [PostDITokens.PostRepository, CoreDITokens.QueryBus]
  },
  {
    provide   : PostDITokens.GetPostListUseCase,
    useFactory: (postRepository) => new GetPostListService(postRepository),
    inject    : [PostDITokens.PostRepository]
  },
  {
    provide   : PostDITokens.GetPostUseCase,
    useFactory: (postRepository) => new GetPostService(postRepository),
    inject    : [PostDITokens.PostRepository]
  },
  {
    provide   : PostDITokens.PublishPostUseCase,
    useFactory: (postRepository) => {
      const service: PublishPostUseCase = new PublishPostService(postRepository);
      return new TransactionalUseCaseWrapper(service);
    },
    inject    : [PostDITokens.PostRepository]
  },
  {
    provide   : PostDITokens.RemovePostUseCase,
    useFactory: (postRepository) => {
      const service: RemovePostUseCase = new RemovePostService(postRepository);
      return new TransactionalUseCaseWrapper(service);
    },
    inject    : [PostDITokens.PostRepository]
  },
];

const handlerProviders: Provider[] = [
  {
    provide  : NestWrapperPostImageRemovedEventHandler,
    useClass : NestWrapperPostImageRemovedEventHandler,
  },
  {
    provide   : PostDITokens.PostImageRemovedEventHandler,
    useFactory: (postRepository) => new HandlePostImageRemovedEventService(postRepository),
    inject    : [PostDITokens.PostRepository]
  }
];

@Module({
  controllers: [
    PostController
  ],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...handlerProviders,
  ]
})
export class PostModule {}
