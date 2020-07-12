export interface EventBusPort {
  sendEvent<TEvent extends Record<string, unknown>>(event: TEvent): Promise<void>;
}
