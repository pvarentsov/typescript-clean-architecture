import { UseCase } from '@core/common/usecase/UseCase';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface GetPostListUseCase extends UseCase<GetPostListPort, PostUseCaseDto[]> {}
