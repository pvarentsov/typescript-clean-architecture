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
import * as fs from 'fs';
import * as path from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


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
      // name                     : 'postgres',
      type: 'postgres',
      host                     : DatabaseConfig.DB_HOST,
      port                     : DatabaseConfig.DB_PORT,
      username                 : DatabaseConfig.DB_USERNAME,
      password                 : DatabaseConfig.DB_PASSWORD,
      database                 : DatabaseConfig.DB_NAME,
      logging                  : 'all',
      logger                   : TypeOrmLogger.new(),
      entities                 : [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
      migrationsRun            : true,
      migrations               : [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
      migrationsTransactionMode: 'all',
      // ssl: {
      //   ca: fs.readFileSync('/Users/adrian/Development/Github/NestJs/typescript-clean-architecture/certs/global-bundle.pem')
      // }
    } as PostgresConnectionOptions)
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
