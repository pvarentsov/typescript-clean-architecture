import { GetUserPreviewQuery } from '@core/common/message/query/queries/user/GetUserPreviewQuery';
import { GetUserPreviewQueryResult } from '@core/common/message/query/queries/user/result/GetUserPreviewQueryResult';
import { Optional } from '@core/common/type/CommonTypes';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { GetUserPreviewQueryHandler } from '@core/domain/user/handler/GetUserPreviewQueryHandler';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetUserPreviewQuery)
export class NestWrapperGetUserPreviewQueryHandler implements IQueryHandler {
  
  constructor(
    @Inject(UserDITokens.GetUserPreviewQueryHandler)
    private readonly handleService: GetUserPreviewQueryHandler
  ) {}

  public async execute(query: GetUserPreviewQuery): Promise<Optional<GetUserPreviewQueryResult>> {
    return this.handleService.handle(query);
  }
  
}
