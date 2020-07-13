import { UseCase } from '../../../shared/usecase/UseCase';
import { GetMediaPort } from '../port/usecase/GetMediaPort';
import { MediaUseCaseDto } from './dto/MediaUseCaseDto';

export interface GetMediaUseCase extends UseCase<GetMediaPort, MediaUseCaseDto> {}
