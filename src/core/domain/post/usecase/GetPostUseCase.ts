import { UseCase } from '../../.shared/usecase/UseCase';
import { PostOutPort } from '../port/usecase/PostOutPort';
import { GetPostInPort } from '../port/usecase/GetPostInPort';

export interface GetPostUseCase extends UseCase<GetPostInPort, PostOutPort> {}
