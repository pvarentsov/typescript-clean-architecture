import { UseCase } from '@core/common/usecase/UseCase';
import { EditMediaPort } from '@core/domain/media/port/usecase/EditMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface EditMediaUseCase extends UseCase<EditMediaPort, MediaUseCaseDto> {}
