import { UseCase } from '@core/common/usecase/UseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostListPort } from '@core/domain/post/port/usecase/GetPostListPort';

export interface GetPostListUseCase extends UseCase<GetPostListPort, PostUseCaseDto[]> {}
