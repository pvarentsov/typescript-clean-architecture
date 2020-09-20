import { TransactionalUseCase } from '@core/common/usecase/TransactionalUseCase';
import { CreateMediaPort } from '@core/domain/media/port/usecase/CreateMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface CreateMediaUseCase extends TransactionalUseCase<CreateMediaPort, MediaUseCaseDto> {}
