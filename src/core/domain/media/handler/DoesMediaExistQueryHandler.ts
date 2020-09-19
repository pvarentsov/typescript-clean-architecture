import { DoesMediaExistQuery } from '@core/common/message/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '@core/common/message/query/queries/media/result/DoesMediaExistQueryResult';
import { QueryHandler } from '@core/common/message/query/QueryHandler';

export interface DoesMediaExistQueryHandler extends QueryHandler<DoesMediaExistQuery, DoesMediaExistQueryResult> {}
