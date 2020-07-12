import { UseCase } from '../../.shared/usecase/UseCase';
import { RemovePostPort } from '../port/usecase/RemovePostPort';

export interface RemovePostUseCase extends UseCase<RemovePostPort, void> {}
