export interface EventHandler<TEvent> {
  handle(event: TEvent): Promise<void>;
}
