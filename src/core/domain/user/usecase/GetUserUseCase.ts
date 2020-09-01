import { UseCase } from '@core/common/usecase/UseCase';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';

export interface GetUserUseCase extends UseCase<GetUserPort, UserUseCaseDto> {}
