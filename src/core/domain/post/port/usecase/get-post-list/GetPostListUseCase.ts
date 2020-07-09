import { UseCase } from '../../../../.shared/port/usecase/UseCase';
import { PostUseCaseCommonOutPort } from '../PostUseCaseCommonOutPort';
import { GetPostUseListCaseInPort } from './GetPostUseListCaseInPort';

export interface GetPostListUseCase extends UseCase<GetPostUseListCaseInPort, PostUseCaseCommonOutPort> {}
