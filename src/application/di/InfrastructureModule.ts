import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmDirectory } from '../../infrastructure/adapter/persistence/typeorm/TypeOrmDirectory';
import { CoreDITokens } from '../../core/common/di/CoreDITokens';
import { NestCommandBusAdapter } from '../../infrastructure/adapter/cqers/NestCommandBusAdapter';
import { NestEventBusAdapter } from '../../infrastructure/adapter/cqers/NestEventBusAdapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { NestExceptionFilter } from '../../infrastructure/exception/NestExceptionFilter';
import { NestQueryBusAdapter } from '../../infrastructure/adapter/cqers/NestQueryBusAdapter';

/**
 * TODO:
 * 1. Add config
 * 2. Remove hardcode
 */

@Global()
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      name                     : 'default',
      type                     : 'postgres',
      host                     : 'localhost',
      port                     : 5454,
      username                 : 'iposter',
      password                 : 'souQu6ienug0ash9eeY9',
      database                 : 'iposter',
      logging                  : 'all',
      entities                 : [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
      migrationsRun            : true,
      migrations               : [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
      migrationsTransactionMode: 'all',
    })
  ],
  providers: [
    {
      provide : APP_FILTER,
      useClass: NestExceptionFilter,
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
