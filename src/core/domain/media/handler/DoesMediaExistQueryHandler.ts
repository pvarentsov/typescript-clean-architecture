import { QueryHandler } from '../../../common/cqers/query/QueryHandler';
import { DoesMediaExistQuery } from '../../../common/cqers/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '../../../common/cqers/query/queries/media/result/DoesMediaExistQueryResult';

export interface DoesMediaExistQueryHandler extends QueryHandler<DoesMediaExistQuery, DoesMediaExistQueryResult> {}
