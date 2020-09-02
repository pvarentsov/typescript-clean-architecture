import { UseCase } from '@core/common/usecase/UseCase';
import { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';

export interface GetUserUseCase extends UseCase<GetUserPort, UserUseCaseDto> {}
