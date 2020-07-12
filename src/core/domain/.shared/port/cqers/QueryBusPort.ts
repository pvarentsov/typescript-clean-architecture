export interface QueryBusPort {
  sendQuery<TQuery extends object, TQueryResult>(query: TQuery): Promise<TQueryResult>;
}
