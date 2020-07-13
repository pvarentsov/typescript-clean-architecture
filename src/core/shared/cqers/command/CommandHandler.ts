export interface CommandHandler<TCommand, TCommandResult> {
  handle(command: TCommand): Promise<TCommandResult>;
}
