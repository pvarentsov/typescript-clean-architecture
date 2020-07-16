import { QueryHandler } from '../../../common/cqers/query/QueryHandler';
import { GetUserPreviewQuery } from '../../../common/cqers/query/queries/user/GetUserPreviewQuery';
import { GetUserPreviewQueryResult } from '../../../common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { Optional } from '../../../common/type/CommonTypes';

export interface GetUserPreviewQueryHandler extends QueryHandler<GetUserPreviewQuery, Optional<GetUserPreviewQueryResult>> {}
