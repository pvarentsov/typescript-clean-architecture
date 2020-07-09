import { UseCase } from '../../.shared/usecase/UseCase';
import { PublishPostUseCaseInPort } from '../port/usecase/PublishPostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../port/usecase/PostUseCaseCommonOutPort';

export interface PublishPostUseCase extends UseCase<PublishPostUseCaseInPort, PostUseCaseCommonOutPort> {}
