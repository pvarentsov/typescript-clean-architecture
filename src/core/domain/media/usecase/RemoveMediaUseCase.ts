import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { RemoveMediaPort } from '@core/domain/media/port/usecase/RemoveMediaPort';

export interface RemoveMediaUseCase extends TransactionalUseCase<RemoveMediaPort, void> {}
