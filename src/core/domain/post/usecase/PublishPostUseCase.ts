import { UseCase } from '@core/common/usecase/UseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';

export interface PublishPostUseCase extends UseCase<PublishPostPort, PostUseCaseDto> {}
