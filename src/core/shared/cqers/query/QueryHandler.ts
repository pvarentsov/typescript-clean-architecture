export interface QueryHandler<TQuery, TQueryResult> {
  handle(query: TQuery): Promise<TQueryResult>;
}
