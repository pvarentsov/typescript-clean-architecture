import { Exception } from '../../exception/Exception';
import { Nullable, Optional } from '../../type/CommonTypes';

export class CoreAssert {
  
  public static isTrue(expression: boolean, exception: Exception<unknown>): void {
    if (!expression) {
      throw exception;
    }
  }
  public static isFalse(expression: boolean, exception: Exception<unknown>): void {
    if (expression) {
      throw exception;
    }
  }
  public static notEmpty<T>(value: Optional<Nullable<T>>, exception: Exception<unknown>): T {
    if (value === null || value === undefined) {
      throw exception;
    }
    return value;
  }

}
