import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { RemovePostPort } from '@core/domain/post/port/usecase/RemovePostPort';

export interface RemovePostUseCase extends TransactionalUseCase<RemovePostPort, void> {}
