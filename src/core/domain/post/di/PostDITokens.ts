export class PostDITokens {
  
  // Use-cases
  
  public static readonly CreatePostUseCase: unique symbol  = Symbol('CreatePostUseCase');
  public static readonly EditPostUseCase: unique symbol    = Symbol('EditPostUseCase');
  public static readonly GetPostListUseCase: unique symbol = Symbol('GetPostListUseCase');
  public static readonly GetPostUseCase: unique symbol     = Symbol('GetPostUseCase');
  public static readonly PublishPostUseCase: unique symbol = Symbol('PublishPostUseCase');
  public static readonly RemovePostUseCase: unique symbol  = Symbol('RemovePostUseCase');
  
  // Handlers
  
  public static readonly PostImageRemovedEventHandler: unique symbol = Symbol('PostImageRemovedEventHandler');
  
  // Repositories
  
  public static readonly PostRepository: unique symbol  = Symbol('PostRepository');
  
}
