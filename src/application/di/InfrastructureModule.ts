import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/NestHttpExceptionFilter';
import { NestHttpLoggingInterceptor } from '@application/api/http-rest/interceptor/NestHttpLoggingInterceptor';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NestCommandBusAdapter } from '@infrastructure/adapter/cqers/NestCommandBusAdapter';
import { NestEventBusAdapter } from '@infrastructure/adapter/cqers/NestEventBusAdapter';
import { NestQueryBusAdapter } from '@infrastructure/adapter/cqers/NestQueryBusAdapter';
import { TypeOrmLogger } from '@infrastructure/adapter/persistence/typeorm/logger/TypeOrmLogger';
import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/TypeOrmDirectory';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      logging                  : 'all',
      logger                   : TypeOrmLogger.new(),
      entities                 : [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
      migrationsRun            : true,
      migrations               : [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
      migrationsTransactionMode: 'all',
    })
  ],
  providers: [
    {
      provide : APP_FILTER,
      useClass: NestHttpExceptionFilter,
    },
    {
      provide : APP_INTERCEPTOR,
      useClass: NestHttpLoggingInterceptor,
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
    },
  ],
  exports: [
    CoreDITokens.CommandBus,
    CoreDITokens.QueryBus,
    CoreDITokens.EventBus,
  ]
})
export class InfrastructureModule {}
