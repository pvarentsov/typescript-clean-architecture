import { UseCase } from '@core/common/usecase/UseCase';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';

export interface CreatePostUseCase extends UseCase<CreatePostPort, PostUseCaseDto> {}
