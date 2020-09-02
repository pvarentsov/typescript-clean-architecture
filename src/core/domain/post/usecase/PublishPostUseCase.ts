import { UseCase } from '@core/common/usecase/UseCase';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface PublishPostUseCase extends UseCase<PublishPostPort, PostUseCaseDto> {}
