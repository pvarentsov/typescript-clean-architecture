import { DoesMediaExistQuery } from '@core/common/cqers/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '@core/common/cqers/query/queries/media/result/DoesMediaExistQueryResult';
import { QueryHandler } from '@core/common/cqers/query/QueryHandler';

export interface DoesMediaExistQueryHandler extends QueryHandler<DoesMediaExistQuery, DoesMediaExistQueryResult> {}
