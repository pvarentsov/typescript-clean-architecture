import { UseCase } from '../../../../.shared/port/usecase/UseCase';
import { PublishPostUseCaseInPort } from './PublishPostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../PostUseCaseCommonOutPort';

export interface PublishPostUseCase extends UseCase<PublishPostUseCaseInPort, PostUseCaseCommonOutPort> {}
