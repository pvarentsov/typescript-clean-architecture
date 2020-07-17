import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetMediaPreviewQuery } from '../../../core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryHandler } from '../../../core/domain/media/handler/GetMediaPreviewQueryHandler';
import { GetMediaPreviewQueryResult } from '../../../core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { Optional } from '../../../core/common/type/CommonTypes';
import { MediaDITokens } from '../../../core/domain/media/di/MediaDITokens';

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
