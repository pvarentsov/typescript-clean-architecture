import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { Nullable } from '@core/common/type/CommonTypes';
import { TestUtil } from '@test/.common/TestUtil';

export class ExpectTest {
  
  public static expectResponseCodeAndMessage(response: CoreApiResponse<unknown>, expected: {code: number, message: string}): void {
    expect(TestUtil.filterObject(response, ['code', 'message'])).toEqual(expected);
  }
  
  public static expectResponseData(options: {response: CoreApiResponse<unknown>, passFields?: string[]}, expected: Nullable<{}>): void {
    const testingObject: any = options.passFields
      ? TestUtil.filterObject(options.response.data, options.passFields)
      : options.response.data;
    
    expect(testingObject).toEqual(expected);
  }
  
}