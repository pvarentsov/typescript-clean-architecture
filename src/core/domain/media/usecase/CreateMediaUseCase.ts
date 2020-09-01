import { UseCase } from '@core/common/usecase/UseCase';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';

export interface CreateMediaUseCase extends UseCase<CreateMediaPort, MediaUseCaseDto> {}
