export interface CommandBusPort {
  sendCommand<TCommand extends object>(command: TCommand): Promise<void>;
}
