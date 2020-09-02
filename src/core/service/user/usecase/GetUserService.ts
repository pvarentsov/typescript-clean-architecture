import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { Optional } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { UserUseCaseDto } from '@core/domain/user/usecase/dto/UserUseCaseDto';
import { GetUserUseCase } from '@core/domain/user/usecase/GetUserUseCase';

export class GetUserService implements GetUserUseCase {
  
  constructor(
    private readonly userRepository: UserRepositoryPort,
  ) {}
  
  public async execute(payload: GetUserPort): Promise<UserUseCaseDto> {
    const user: Optional<User> = await this.userRepository.findUser({id: payload.userId});
    if (!user) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'User not found.'});
    }
    
    return UserUseCaseDto.newFromUser(user);
  }
  
}
