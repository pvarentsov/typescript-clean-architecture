import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmEntityDirectory } from '../../infrastructure/adapter/persistence/typeorm/entity/TypeOrmEntityDirectory';
import { CoreDITokens } from '../../core/common/di/CoreDITokens';
import { NestCommandBusAdapter } from '../../infrastructure/adapter/cqers/NestCommandBusAdapter';
import { NestEventBusAdapter } from '../../infrastructure/adapter/cqers/NestEventBusAdapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { NestExceptionFilter } from '../../infrastructure/exception/NestExceptionFilter';

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
      name     : 'default',
      type     : 'postgres',
      host     : 'localhost',
      port     : 5454,
      username : 'iposter',
      password : 'souQu6ienug0ash9eeY9',
      database : 'iposter',
      logging  : 'all',
      entities : [`${TypeOrmEntityDirectory}/**/*{.ts,.js}`],
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
      useClass: NestCommandBusAdapter,
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
