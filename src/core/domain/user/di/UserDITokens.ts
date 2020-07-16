export class UserDITokens {
  
  // Use-cases
  
  public static readonly CreateUserUseCase: unique symbol  = Symbol('CreateUserUseCase');
  public static readonly GetUserUseCase: unique symbol     = Symbol('GetUserUseCase');
  
  // Handlers
  
  public static readonly GetUserPreviewQueryHandler: unique symbol = Symbol('GetUserPreviewQueryHandler');
  
  // Repositories
  
  public static readonly UserRepository: unique symbol  = Symbol('UserRepository');
  
}
