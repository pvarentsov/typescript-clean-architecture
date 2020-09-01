import { QueryHandler } from '@core/common/cqers/query/QueryHandler';
import { GetMediaPreviewQueryResult } from '@core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { Optional } from '@core/common/type/CommonTypes';
import { GetMediaPreviewQuery } from '@core/common/cqers/query/queries/media/GetMediaPreviewQuery';

export interface GetMediaPreviewQueryHandler extends QueryHandler<GetMediaPreviewQuery, Optional<GetMediaPreviewQueryResult>> {}
