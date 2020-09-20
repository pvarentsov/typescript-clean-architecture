import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface CreatePostUseCase extends TransactionalUseCase<CreatePostPort, PostUseCaseDto> {}
