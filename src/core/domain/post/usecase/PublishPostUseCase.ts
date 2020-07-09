import { UseCase } from '../../.shared/usecase/UseCase';
import { PublishPostInPort } from '../port/usecase/PublishPostInPort';
import { PostOutPort } from '../port/usecase/PostOutPort';

export interface PublishPostUseCase extends UseCase<PublishPostInPort, PostOutPort> {}
