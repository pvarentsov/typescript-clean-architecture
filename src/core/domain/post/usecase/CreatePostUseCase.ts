import { UseCase } from '../../../common/usecase/UseCase';
import { CreatePostPort } from '../port/usecase/CreatePostPort';
import { PostUseCaseDto } from './dto/PostUseCaseDto';

export interface CreatePostUseCase extends UseCase<CreatePostPort, PostUseCaseDto> {}
