import { UseCase } from '@core/common/usecase/UseCase';
import { RemovePostPort } from '@core/domain/post/port/usecase/RemovePostPort';

export interface RemovePostUseCase extends UseCase<RemovePostPort, void> {}
