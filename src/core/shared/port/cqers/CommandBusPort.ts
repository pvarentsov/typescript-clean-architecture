export interface CommandBusPort {
  sendCommand<TCommand extends Record<string, unknown>>(command: TCommand): Promise<void>;
}
