import { UseCase } from '@core/common/usecase/UseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { GetPostPort } from '@core/domain/post/port/usecase/GetPostPort';

export interface GetPostUseCase extends UseCase<GetPostPort, PostUseCaseDto> {}
