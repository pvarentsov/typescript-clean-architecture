import { UseCase } from '@core/common/usecase/UseCase';
import { CreatePostPort } from '@core/domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';

export interface CreatePostUseCase extends UseCase<CreatePostPort, PostUseCaseDto> {}
