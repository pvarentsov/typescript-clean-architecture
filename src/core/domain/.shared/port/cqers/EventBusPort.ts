export interface EventBusPort {
  sendEvent<TEvent extends object>(event: TEvent): Promise<void>;
}
