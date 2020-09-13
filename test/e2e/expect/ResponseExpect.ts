import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { Nullable } from '@core/common/type/CommonTypes';
import { TestUtil } from '@test/.common/TestUtil';

export class ResponseExpect {
  
  public static codeAndMessage(response: CoreApiResponse<unknown>, expected: {code: number, message: string}): void {
    expect(TestUtil.filterObject(response, ['code', 'message'])).toEqual(expected);
  }
  
  public static data(options: {response: CoreApiResponse<unknown>, passFields?: string[]}, expected: Nullable<Record<string, unknown>>): void {
    const testingObject: Record<string, unknown> = options.passFields
      ? TestUtil.filterObject(options.response.data, options.passFields)
      : options.response.data as Record<string, unknown>;
    
    expect(testingObject).toEqual(expected);
  }
  
}