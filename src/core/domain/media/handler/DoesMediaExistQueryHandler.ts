import { QueryHandler } from '@core/common/cqers/query/QueryHandler';
import { DoesMediaExistQueryResult } from '@core/common/cqers/query/queries/media/result/DoesMediaExistQueryResult';
import { DoesMediaExistQuery } from '@core/common/cqers/query/queries/media/DoesMediaExistQuery';

export interface DoesMediaExistQueryHandler extends QueryHandler<DoesMediaExistQuery, DoesMediaExistQueryResult> {}
