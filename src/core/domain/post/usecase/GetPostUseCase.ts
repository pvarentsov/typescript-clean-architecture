import { UseCase } from '@core/common/usecase/UseCase';
import { GetPostPort } from '@core/domain/post/port/usecase/GetPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface GetPostUseCase extends UseCase<GetPostPort, PostUseCaseDto> {}
