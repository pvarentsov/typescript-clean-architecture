import { GetUserPreviewQuery } from '@core/common/cqers/query/queries/user/GetUserPreviewQuery';
import { GetUserPreviewQueryResult } from '@core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { QueryHandler } from '@core/common/cqers/query/QueryHandler';
import { Optional } from '@core/common/type/CommonTypes';

export interface GetUserPreviewQueryHandler extends QueryHandler<GetUserPreviewQuery, Optional<GetUserPreviewQueryResult>> {}
