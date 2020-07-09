import { UseCase } from '../../.shared/usecase/UseCase';
import { EditPostInPort } from '../port/usecase/EditPostInPort';
import { PostOutPort } from '../port/usecase/PostOutPort';

export interface EditPostUseCase extends UseCase<EditPostInPort, PostOutPort> {}
