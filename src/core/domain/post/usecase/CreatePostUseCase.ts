import { UseCase } from '../../.shared/usecase/UseCase';
import { CreatePostInPort } from '../port/usecase/CreatePostInPort';
import { PostOutPort } from '../port/usecase/PostOutPort';

export interface CreatePostUseCase extends UseCase<CreatePostInPort, PostOutPort> {}
