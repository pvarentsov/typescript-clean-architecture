export interface CommandHandler<TCommand> {
  handle(command: TCommand): Promise<void>;
}
