export interface QueryBusPort {
  sendQuery<TQuery, TQueryResult>(query: TQuery): Promise<TQueryResult>;
}
