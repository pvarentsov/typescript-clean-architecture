import { UseCase } from '../../../shared/usecase/UseCase';
import { GetPostListPort } from '../port/usecase/GetPostListPort';
import { PostUseCaseDto } from './dto/PostUseCaseDto';

export interface GetPostListUseCase extends UseCase<GetPostListPort, PostUseCaseDto[]> {}
