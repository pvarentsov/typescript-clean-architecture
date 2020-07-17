import { QueryHandler } from '../../../common/cqers/query/QueryHandler';
import { Optional } from '../../../common/type/CommonTypes';
import { GetMediaPreviewQuery } from '../../../common/cqers/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '../../../common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';

export interface GetMediaPreviewQueryHandler extends QueryHandler<GetMediaPreviewQuery, Optional<GetMediaPreviewQueryResult>> {}
