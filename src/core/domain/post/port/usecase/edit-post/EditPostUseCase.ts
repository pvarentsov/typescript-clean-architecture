import { UseCase } from '../../../../.shared/port/usecase/UseCase';
import { EditPostUseCaseInPort } from './EditPostUseCaseInPort';
import { PostUseCaseCommonOutPort } from '../PostUseCaseCommonOutPort';

export interface EditPostUseCase extends UseCase<EditPostUseCaseInPort, PostUseCaseCommonOutPort> {}
