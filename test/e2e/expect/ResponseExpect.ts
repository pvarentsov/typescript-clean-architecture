import { CoreApiResponse } from '@core/common/api/CoreApiResponse';
import { Nullable } from '@core/common/type/CommonTypes';
import { TestUtil } from '@test/.common/TestUtil';

export class ResponseExpect {
  
  public static codeAndMessage(response: CoreApiResponse<unknown>, expected: {code: number, message: string}): void {
    expect(TestUtil.filterObject(response, ['code', 'message'])).toEqual(expected);
  }
  
  public static data(options: {response: CoreApiResponse<unknown>, passFields?: string[]}, expected: Nullable<unknown>): void {
    const toFilterObject = (object: any): unknown => {
      return options.passFields
        ? TestUtil.filterObject(object, options.passFields)
        : object;
    };
    
    const filteredData: unknown = Array.isArray(options.response.data)
      ? options.response.data.map(item => toFilterObject(item))
      : toFilterObject(options.response.data);
    
    expect(filteredData).toEqual(expected);
  }
  
}