export class PostDITokens {
  
  // Use-cases
  
  public static readonly CreatePostPort: unique symbol  = Symbol('CreatePostPort');
  public static readonly EditPostPort: unique symbol    = Symbol('EditPostPort');
  public static readonly GetPostListPort: unique symbol = Symbol('GetPostListPort');
  public static readonly GetPostPort: unique symbol     = Symbol('GetPostPort');
  public static readonly PublishPostPort: unique symbol = Symbol('PublishPostPort');
  public static readonly RemovePostPort: unique symbol  = Symbol('RemovePostPort');
  
  // Handlers
  
  public static readonly PostImageRemovedEventHandler: unique symbol = Symbol('PostImageRemovedEventHandler');
  
}
