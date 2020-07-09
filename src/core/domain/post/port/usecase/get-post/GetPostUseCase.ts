import { UseCase } from '../../../../.shared/port/usecase/UseCase';
import { PostUseCaseCommonOutPort } from '../PostUseCaseCommonOutPort';
import { GetPostUseCaseInPort } from './GetPostUseCaseInPort';

export interface GetPostUseCase extends UseCase<GetPostUseCaseInPort, PostUseCaseCommonOutPort> {}
