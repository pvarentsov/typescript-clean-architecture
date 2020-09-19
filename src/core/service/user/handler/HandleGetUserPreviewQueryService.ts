import { GetUserPreviewQuery } from '@core/common/message/query/queries/user/GetUserPreviewQuery';
import { GetUserPreviewQueryResult } from '@core/common/message/query/queries/user/result/GetUserPreviewQueryResult';
import { Optional } from '@core/common/type/CommonTypes';
import { User } from '@core/domain/user/entity/User';
import { GetUserPreviewQueryHandler } from '@core/domain/user/handler/GetUserPreviewQueryHandler';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';

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
