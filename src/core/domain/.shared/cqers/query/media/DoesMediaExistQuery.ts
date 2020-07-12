import { RepositoryFindOptions } from '../../../persistence/RepositoryOptions';

export class DoesMediaExistQuery {
  
  by: {id: string}
  
  options?: RepositoryFindOptions;
  
  private constructor(by: {id: string}, options?: RepositoryFindOptions) {
    this.by = by;
    this.options = options;
  }
  
  public static new(by: {id: string}, options?: RepositoryFindOptions): DoesMediaExistQuery {
    return new DoesMediaExistQuery(by, options);
  }
  
}
