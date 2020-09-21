import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/NestHttpExceptionFilter';
import { NestHttpLoggingInterceptor } from '@application/api/http-rest/interceptor/NestHttpLoggingInterceptor';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NestCommandBusAdapter } from '@infrastructure/adapter/message/NestCommandBusAdapter';
import { NestEventBusAdapter } from '@infrastructure/adapter/message/NestEventBusAdapter';
import { NestQueryBusAdapter } from '@infrastructure/adapter/message/NestQueryBusAdapter';
import { TypeOrmLogger } from '@infrastructure/adapter/persistence/typeorm/logger/TypeOrmLogger';
import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/TypeOrmDirectory';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { Global, Module, OnApplicationBootstrap, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

const providers: Provider[] = [
  {
    provide : APP_FILTER,
    useClass: NestHttpExceptionFilter,
  },
  {
    provide: CoreDITokens.CommandBus,
    useClass: NestCommandBusAdapter,
  },
  {
    provide: CoreDITokens.QueryBus,
    useClass: NestQueryBusAdapter,
  },
  {
    provide: CoreDITokens.EventBus,
    useClass: NestEventBusAdapter,
  }
];

if (ApiServerConfig.LOG_ENABLE) {
  providers.push({
    provide : APP_INTERCEPTOR,
    useClass: NestHttpLoggingInterceptor,
  });
}

@Global()
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      name                     : 'default',
      type                     : 'postgres',
      host                     : DatabaseConfig.DB_HOST,
      port                     : DatabaseConfig.DB_PORT,
      username                 : DatabaseConfig.DB_USERNAME,
      password                 : DatabaseConfig.DB_PASSWORD,
      database                 : DatabaseConfig.DB_NAME,
      logging                  : DatabaseConfig.DB_LOG_ENABLE ? 'all' : false,
      logger                   : DatabaseConfig.DB_LOG_ENABLE ? TypeOrmLogger.new() : undefined,
      entities                 : [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
      migrationsRun            : true,
      migrations               : [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
      migrationsTransactionMode: 'all',
    })
  ],
  providers: providers,
  exports: [
    CoreDITokens.CommandBus,
    CoreDITokens.QueryBus,
    CoreDITokens.EventBus,
  ]
})
export class InfrastructureModule implements OnApplicationBootstrap {
  onApplicationBootstrap(): void {
    initializeTransactionalContext();
  }
}
