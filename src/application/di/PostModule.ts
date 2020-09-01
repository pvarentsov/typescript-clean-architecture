import { Module, Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { CreatePostService } from '@core/service/post/usecase/CreatePostService';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { EditPostService } from '@core/service/post/usecase/EditPostService';
import { GetPostListService } from '@core/service/post/usecase/GetPostListService';
import { GetPostService } from '@core/service/post/usecase/GetPostService';
import { PublishPostService } from '@core/service/post/usecase/PublishPostService';
import { RemovePostService } from '@core/service/post/usecase/RemovePostService';
import { HandlePostImageRemovedEventService } from '@core/service/post/handler/HandlePostImageRemovedEventService';
import { PostController } from '@application/api/http-rest/controller/PostController';
import { NestWrapperPostImageRemovedEventHandler } from '@infrastructure/handler/post/NestWrapperPostImageRemovedEventHandler';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';

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
    useFactory: (postRepository, queryBus) => new CreatePostService(postRepository, queryBus),
    inject    : [PostDITokens.PostRepository, CoreDITokens.QueryBus]
  },
  {
    provide   : PostDITokens.EditPostUseCase,
    useFactory: (postRepository, queryBus) => new EditPostService(postRepository, queryBus),
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
    useFactory: (postRepository) => new PublishPostService(postRepository),
    inject    : [PostDITokens.PostRepository]
  },
  {
    provide   : PostDITokens.RemovePostUseCase,
    useFactory: (postRepository) => new RemovePostService(postRepository),
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
