import { UseCase } from '../../../common/usecase/UseCase';
import { CreateUserPort } from '../port/usecase/CreateUserPort';
import { UserUseCaseDto } from './dto/UserUseCaseDto';

export interface CreateUserUseCase extends UseCase<CreateUserPort, UserUseCaseDto> {}
