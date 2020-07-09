import { UseCase } from '../../.shared/usecase/UseCase';
import { EditPostUseCaseInPort } from '../port/usecase/EditPostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../port/usecase/PostUseCaseCommonOutPort';

export interface EditPostUseCase extends UseCase<EditPostUseCaseInPort, PostUseCaseCommonOutPort> {}
