import { Module } from '@nestjs/common';
import { PostDITokens } from '../../core/domain/post/di/PostDITokens';
import { Connection } from 'typeorm';
import { TypeOrmPostRepositoryAdapter } from '../../infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { CreatePostService } from '../../core/service/post/usecase/CreatePostService';
import { EditPostService } from '../../core/service/post/usecase/EditPostService';
import { GetPostListService } from '../../core/service/post/usecase/GetPostListService';
import { GetPostService } from '../../core/service/post/usecase/GetPostService';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { RemovePostService } from '../../core/service/post/usecase/RemovePostService';
import { CoreDITokens } from '../../core/common/di/CoreDITokens';
import { PublishPostService } from '../../core/service/post/usecase/PublishPostService';
import { NestWrapperPostImageRemovedEventHandler } from '../../infrastructure/handler/media/NestWrapperPostImageRemovedEventHandler';
import { HandlePostImageRemovedEventService } from '../../core/service/post/handler/HandlePostImageRemovedEventService';

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
    inject    : [PostDITokens.PublishPostUseCase]
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
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...handlerProviders,
  ]
})
export class PostModule {}
