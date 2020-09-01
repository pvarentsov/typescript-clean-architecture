import { QueryHandler } from '@core/common/cqers/query/QueryHandler';
import { GetUserPreviewQueryResult } from '@core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { Optional } from '@core/common/type/CommonTypes';
import { GetUserPreviewQuery } from '@core/common/cqers/query/queries/user/GetUserPreviewQuery';

export interface GetUserPreviewQueryHandler extends QueryHandler<GetUserPreviewQuery, Optional<GetUserPreviewQueryResult>> {}
