import { UseCase } from '../../.shared/usecase/UseCase';
import { CreatePostUseCaseInPort } from '../port/usecase/CreatePostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../port/usecase/PostUseCaseCommonOutPort';

export interface CreatePostUseCase extends UseCase<CreatePostUseCaseInPort, PostUseCaseCommonOutPort> {}
