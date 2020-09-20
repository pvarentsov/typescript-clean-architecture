import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { EditMediaPort } from '@core/domain/media/port/usecase/EditMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface EditMediaUseCase extends TransactionalUseCase<EditMediaPort, MediaUseCaseDto> {}
