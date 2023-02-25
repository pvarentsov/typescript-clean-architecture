import { CommandBusPort } from '@core/common/port/message/CommandBusPort';
import { Injectable } from '@nestjs/common';
import { CommandBus, IEvent } from '@nestjs/cqrs';

@Injectable()
export class NestCommandBusAdapter implements CommandBusPort {
  
  constructor(
    private readonly commandBus: CommandBus
  ) {}
  
  public async sendCommand<TCommand>(command: TCommand): Promise<void> {
    return this.commandBus.execute(command as IEvent);
  }
  
}
