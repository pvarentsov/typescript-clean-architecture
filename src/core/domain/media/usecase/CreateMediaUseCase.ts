import { UseCase } from '../../../common/usecase/UseCase';
import { CreateMediaPort } from '../port/usecase/CreateMediaPort';
import { MediaUseCaseDto } from './dto/MediaUseCaseDto';

export interface CreateMediaUseCase extends UseCase<CreateMediaPort, MediaUseCaseDto> {}
