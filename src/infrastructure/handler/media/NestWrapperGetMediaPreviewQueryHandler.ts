import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { Optional } from '@core/common/type/CommonTypes';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { GetMediaPreviewQueryHandler } from '@core/domain/media/handler/GetMediaPreviewQueryHandler';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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
