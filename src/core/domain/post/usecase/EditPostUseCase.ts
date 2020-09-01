import { UseCase } from '@core/common/usecase/UseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';

export interface EditPostUseCase extends UseCase<EditPostPort, PostUseCaseDto> {}
