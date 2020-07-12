import { UseCase } from '../../../shared/usecase/UseCase';
import { GetPostPort } from '../port/usecase/GetPostPort';
import { PostUseCaseDto } from './dto/PostUseCaseDto';

export interface GetPostUseCase extends UseCase<GetPostPort, PostUseCaseDto> {}
