import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { QueryHandler } from '@core/common/message/query/QueryHandler';
import { Optional } from '@core/common/type/CommonTypes';

export interface GetMediaPreviewQueryHandler extends QueryHandler<GetMediaPreviewQuery, Optional<GetMediaPreviewQueryResult>> {}
