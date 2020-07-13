import { CommandBus } from '@nestjs/cqrs';
import { CommandBusPort } from '../../../core/common/port/cqers/CommandBusPort';

export class NestCommandBusAdapter implements CommandBusPort {
  
  private readonly commandBus: CommandBus;
  
  public async sendCommand<TCommand>(command: TCommand): Promise<void> {
    return this.commandBus.execute(command);
  }
  
}
