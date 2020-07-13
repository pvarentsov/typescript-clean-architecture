import { UseCase } from '../../../common/usecase/UseCase';
import { PublishPostPort } from '../port/usecase/PublishPostPort';
import { PostUseCaseDto } from './dto/PostUseCaseDto';

export interface PublishPostUseCase extends UseCase<PublishPostPort, PostUseCaseDto> {}
