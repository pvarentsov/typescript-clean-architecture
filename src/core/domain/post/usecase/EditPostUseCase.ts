import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface EditPostUseCase extends TransactionalUseCase<EditPostPort, PostUseCaseDto> {}
