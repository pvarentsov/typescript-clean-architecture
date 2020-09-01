import { UseCase } from '@core/common/usecase/UseCase';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { CreateUserPort } from '@core/domain/user/port/usecase/CreateUserPort';

export interface CreateUserUseCase extends UseCase<CreateUserPort, UserUseCaseDto> {}
