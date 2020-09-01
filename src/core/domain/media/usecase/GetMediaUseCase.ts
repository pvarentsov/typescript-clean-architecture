import { UseCase } from '@core/common/usecase/UseCase';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaPort } from '@core/domain/media/port/usecase/GetMediaPort';

export interface GetMediaUseCase extends UseCase<GetMediaPort, MediaUseCaseDto> {}
