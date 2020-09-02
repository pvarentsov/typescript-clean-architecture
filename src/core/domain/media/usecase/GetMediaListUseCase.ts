import { UseCase } from '@core/common/usecase/UseCase';
import { GetMediaListPort } from '@core/domain/media/port/usecase/GetMediaListPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';

export interface GetMediaListUseCase extends UseCase<GetMediaListPort, MediaUseCaseDto[]> {}
