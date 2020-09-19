export class DoesMediaExistQueryResult {
  
  public readonly doesExist: boolean;
  
  constructor(doesExist: boolean) {
    this.doesExist = doesExist;
  }
  
  public static new(doesExist: boolean): DoesMediaExistQueryResult {
    return new DoesMediaExistQueryResult(doesExist);
  }
  
}
