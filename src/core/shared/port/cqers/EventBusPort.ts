export interface EventBusPort {
  // eslint-disable-next-line @typescript-eslint/ban-types
  sendEvent<TEvent extends object>(event: TEvent): Promise<void>;
}
