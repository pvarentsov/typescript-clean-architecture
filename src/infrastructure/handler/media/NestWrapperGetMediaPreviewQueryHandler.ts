import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetMediaPreviewQuery } from '@core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { GetMediaPreviewQueryHandler } from '@core/domain/media/handler/GetMediaPreviewQueryHandler';
import { Optional } from '@core/common/type/CommonTypes';
import { GetMediaPreviewQueryResult } from '@core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';

@Injectable()
@QueryHandler(GetMediaPreviewQuery)
export class NestWrapperGetMediaPreviewQueryHandler implements IQueryHandler {
  
  constructor(
    @Inject(MediaDITokens.GetMediaPreviewQueryHandler)
    private readonly handleService: GetMediaPreviewQueryHandler
  ) {}

  public async execute(query: GetMediaPreviewQuery): Promise<Optional<GetMediaPreviewQueryResult>> {
    return this.handleService.handle(query);
  }
  
}
