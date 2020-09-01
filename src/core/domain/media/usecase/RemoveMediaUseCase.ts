import { UseCase } from '@core/common/usecase/UseCase';
import { RemoveMediaPort } from '@core/domain/media/port/usecase/RemoveMediaPort';

export interface RemoveMediaUseCase extends UseCase<RemoveMediaPort, void> {}
