import { UseCase } from '../../.shared/usecase/UseCase';
import { PostOutPort } from '../port/usecase/PostOutPort';
import { GetPostListInPort } from '../port/usecase/GetPostListInPort';

export interface GetPostListUseCase extends UseCase<GetPostListInPort, PostOutPort> {}
