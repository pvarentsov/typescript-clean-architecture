import { GetUserPreviewQueryHandler } from '../../../domain/user/handler/GetUserPreviewQueryHandler';
import { GetUserPreviewQuery } from '../../../common/cqers/query/queries/user/GetUserPreviewQuery';
import { UserRepositoryPort } from '../../../domain/user/port/persistence/UserRepositoryPort';
import { Optional } from '../../../common/type/CommonTypes';
import { User } from '../../../domain/user/entity/User';
import { GetUserPreviewQueryResult } from '../../../common/cqers/query/queries/user/result/GetUserPreviewQueryResult';

export class HandleGetUserPreviewQueryService implements GetUserPreviewQueryHandler {
  
  constructor(
    private readonly userRepository: UserRepositoryPort,
  ) {}
  
  public async handle(query: GetUserPreviewQuery): Promise<Optional<GetUserPreviewQueryResult>> {
    let queryResult: Optional<GetUserPreviewQueryResult>;
    
    const user: Optional<User> = await this.userRepository.findUser(query.by, query.options);
    if (user) {
      queryResult = GetUserPreviewQueryResult.new(user.getId(), user.getName(), user.getRole());
    }
    
    return queryResult;
  }
  
}
