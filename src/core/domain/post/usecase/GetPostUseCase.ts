import { UseCase } from '../../.shared/usecase/UseCase';
import { PostUseCaseCommonOutPort } from '../port/usecase/PostUseCaseCommonOutPort';
import { GetPostUseCaseInPort } from '../port/usecase/GetPostUseCaseInPort';

export interface GetPostUseCase extends UseCase<GetPostUseCaseInPort, PostUseCaseCommonOutPort> {}
