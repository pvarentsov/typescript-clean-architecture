import { UseCase } from '@core/common/usecase/UseCase';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaListPort } from '@core/domain/media/port/usecase/GetMediaListPort';

export interface GetMediaListUseCase extends UseCase<GetMediaListPort, MediaUseCaseDto[]> {}
