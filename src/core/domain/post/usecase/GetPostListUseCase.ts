import { UseCase } from '../../.shared/usecase/UseCase';
import { PostUseCaseCommonOutPort } from '../port/usecase/PostUseCaseCommonOutPort';
import { GetPostUseListCaseInPort } from '../port/usecase/GetPostUseListCaseInPort';

export interface GetPostListUseCase extends UseCase<GetPostUseListCaseInPort, PostUseCaseCommonOutPort> {}
