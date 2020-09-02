import { UseCase } from '@core/common/usecase/UseCase';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface CreateMediaUseCase extends UseCase<CreateMediaPort, MediaUseCaseDto> {}
