import { UseCase } from '../../../common/usecase/UseCase';
import { RemovePostPort } from '../port/usecase/RemovePostPort';

export interface RemovePostUseCase extends UseCase<RemovePostPort, void> {}
