export class MediaDITokens {
  
  // Use-cases
  
  public static readonly CreateMediaUseCase: unique symbol  = Symbol('CreateMediaUseCase');
  public static readonly EditMediaUseCase: unique symbol    = Symbol('EditMediaUseCase');
  public static readonly GetMediaListUseCase: unique symbol = Symbol('GetMediaListUseCase');
  public static readonly GetMediaUseCase: unique symbol     = Symbol('GetMediaUseCase');
  public static readonly RemoveMediaUseCase: unique symbol  = Symbol('RemoveMediaUseCase');
  
  // Handlers
  
  public static readonly DoesMediaExistQueryHandler: unique symbol = Symbol('DoesMediaExistQueryHandler');
  public static readonly GetMediaPreviewQueryHandler: unique symbol = Symbol('GetMediaPreviewQueryHandler');
  
  // Repositories
  
  public static readonly MediaRepository: unique symbol  = Symbol('MediaRepository');
  public static readonly MediaFileStorage: unique symbol = Symbol('MediaFileStorage');
  
}
