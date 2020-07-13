import { RepositoryFindOptions } from '../../../../persistence/RepositoryOptions';

export class DoesMediaExistQuery {
  
  by: {id?: string, userId?: string};
  
  options?: RepositoryFindOptions;
  
  private constructor(by: {id?: string, userId?: string}, options?: RepositoryFindOptions) {
    this.by = by;
    this.options = options;
  }
  
  public static new(by: {id?: string, userId?: string}, options?: RepositoryFindOptions): DoesMediaExistQuery {
    return new DoesMediaExistQuery(by, options);
  }
  
}
