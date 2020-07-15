import { EventBusPort } from '../../../core/common/port/cqers/EventBusPort';
import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestEventBusAdapter implements EventBusPort {
  
  constructor(
    private readonly eventBus: EventBus
  ) {}
  
  public async sendEvent<TEvent>(event: TEvent): Promise<void> {
    return this.eventBus.publish(event);
  }
  
}
