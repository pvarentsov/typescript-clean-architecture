import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DoesMediaExistQuery } from '@core/common/cqers/query/queries/media/DoesMediaExistQuery';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { DoesMediaExistQueryHandler } from '@core/domain/media/handler/DoesMediaExistQueryHandler';
import { DoesMediaExistQueryResult } from '@core/common/cqers/query/queries/media/result/DoesMediaExistQueryResult';

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
