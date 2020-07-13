import { QueryHandler } from '../../../shared/cqers/query/QueryHandler';
import { DoesMediaExistQuery } from '../../../shared/cqers/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '../../../shared/cqers/query/queries/media/result/DoesMediaExistQueryResult';

export interface DoesMediaExistQueryHandler extends QueryHandler<DoesMediaExistQuery, DoesMediaExistQueryResult> {}
