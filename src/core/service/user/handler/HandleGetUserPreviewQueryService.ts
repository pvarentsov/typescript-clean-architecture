import { GetUserPreviewQueryHandler } from '@core/domain/user/handler/GetUserPreviewQueryHandler';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { GetUserPreviewQuery } from '@core/common/cqers/query/queries/user/GetUserPreviewQuery';
import { Optional } from '@core/common/type/CommonTypes';
import { GetUserPreviewQueryResult } from '@core/common/cqers/query/queries/user/result/GetUserPreviewQueryResult';
import { User } from '@core/domain/user/entity/User';

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
