import { DoesMediaExistQuery } from '@core/common/message/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '@core/common/message/query/queries/media/result/DoesMediaExistQueryResult';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { DoesMediaExistQueryHandler } from '@core/domain/media/handler/DoesMediaExistQueryHandler';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(DoesMediaExistQuery)
export class NestWrapperDoesMediaExistQueryHandler implements IQueryHandler {
  
  constructor(
    @Inject(MediaDITokens.DoesMediaExistQueryHandler)
    private readonly handleService: DoesMediaExistQueryHandler
  ) {}

  public async execute(query: DoesMediaExistQuery): Promise<DoesMediaExistQueryResult> {
    return this.handleService.handle(query);
  }
  
}
