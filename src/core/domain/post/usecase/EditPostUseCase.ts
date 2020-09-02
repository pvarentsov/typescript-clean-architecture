import { UseCase } from '@core/common/usecase/UseCase';
import { EditPostPort } from '@core/domain/post/port/usecase/EditPostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface EditPostUseCase extends UseCase<EditPostPort, PostUseCaseDto> {}
