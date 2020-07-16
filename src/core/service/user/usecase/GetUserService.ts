import { Optional } from '../../../common/type/CommonTypes';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { GetUserUseCase } from '../../../domain/user/usecase/GetUserUseCase';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/UserRepositoryPort';
import { GetUserPort } from '../../../domain/user/port/usecase/GetUserPort';
import { UserUseCaseDto } from '../../../domain/user/usecase/dto/UserUseCaseDto';
import { User } from '../../../domain/user/entity/User';

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
