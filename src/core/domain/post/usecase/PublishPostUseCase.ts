import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { PublishPostPort } from '@core/domain/post/port/usecase/PublishPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface PublishPostUseCase extends TransactionalUseCase<PublishPostPort, PostUseCaseDto> {}
