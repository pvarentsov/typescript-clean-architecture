import { EventBusPort } from '../../../core/shared/port/cqers/EventBusPort';
import { EventBus } from '@nestjs/cqrs';

export class NestEventBusAdapter implements EventBusPort {
  
  private readonly eventBus: EventBus;
  
  public async sendEvent<TEvent>(event: TEvent): Promise<void> {
    return this.eventBus.publish(event);
  }
  
}
