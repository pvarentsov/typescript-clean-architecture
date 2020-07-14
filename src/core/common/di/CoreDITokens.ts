export class CoreDITokens {
  
  // CQERS
  
  public static readonly CommandBus: unique symbol = Symbol('CommandBus');
  public static readonly QueryBus: unique symbol   = Symbol('QueryBus');
  public static readonly EventBus: unique symbol   = Symbol('EventBus');
  
}
