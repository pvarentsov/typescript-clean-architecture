import { UseCase } from '../../.shared/usecase/UseCase';
import { EditPostPort } from '../port/usecase/EditPostPort';
import { PostUseCaseDto } from './dto/PostUseCaseDto';

export interface EditPostUseCase extends UseCase<EditPostPort, PostUseCaseDto> {}
