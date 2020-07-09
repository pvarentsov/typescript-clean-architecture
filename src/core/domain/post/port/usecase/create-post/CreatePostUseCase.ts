import { UseCase } from '../../../../.shared/port/usecase/UseCase';
import { CreatePostUseCaseInPort } from './CreatePostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../PostUseCaseCommonOutPort';

export interface CreatePostUseCase extends UseCase<CreatePostUseCaseInPort, PostUseCaseCommonOutPort> {}
