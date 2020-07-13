export interface EventHandler<TEvent, TEventResult> {
  handle(event: TEvent): Promise<TEventResult>;
}
