import { QueryBusPort } from '../../../core/common/port/cqers/QueryBusPort';
import { QueryBus } from '@nestjs/cqrs';

export class NestQueryBusAdapter implements QueryBusPort {
  
  private readonly queryBus: QueryBus;
  
  public async sendQuery<TQuery, TQueryResult>(query: TQuery): Promise<TQueryResult> {
    return this.queryBus.execute(query);
  }
  
}
