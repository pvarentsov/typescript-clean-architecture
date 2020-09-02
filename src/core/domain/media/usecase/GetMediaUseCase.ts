import { UseCase } from '@core/common/usecase/UseCase';
import { GetMediaPort } from '@core/domain/media/port/usecase/GetMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface GetMediaUseCase extends UseCase<GetMediaPort, MediaUseCaseDto> {}
