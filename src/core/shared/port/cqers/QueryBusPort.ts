export interface QueryBusPort {
  sendQuery<TQuery extends Record<string, unknown>, TQueryResult>(query: TQuery): Promise<TQueryResult>;
}
