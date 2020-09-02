import { CoreApiResponse } from '@core/common/api/CoreApiResponse';

describe('CoreApiResponse', () => {

  describe('success', () => {
  
    test('When input args are empty, expect it creates success response with default parameters', () => {
      const currentDate: number = Date.now();
      
      const response: CoreApiResponse<unknown> = CoreApiResponse.success();
      
      expect(response.code).toBe(200);
      expect(response.message).toBe('Success.');
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(response.data).toBeNull();
    });
  
    test('When input args are set, expect it creates success response with custom parameters', () => {
      const currentDate: number = Date.now();
      
      const customMessage: string = 'Success Response.';
      const customData: Record<string, unknown> = {result: customMessage};
      
      const response: CoreApiResponse<unknown> = CoreApiResponse.success(customData, customMessage);
    
      expect(response.code).toBe(200);
      expect(response.message).toBe(customMessage);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(response.data).toEqual(customData);
    });
    
  });
  
  describe('error', () => {
    
    test('When input args are empty, expect it creates error response with default parameters', () => {
      const currentDate: number = Date.now();
      
      const response: CoreApiResponse<unknown> = CoreApiResponse.error();
      
      expect(response.code).toBe(500);
      expect(response.message).toBe('Internal error.');
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(response.data).toBeNull();
    });
    
    test('When input args are set, expect it creates error response with custom parameters', () => {
      const currentDate: number = Date.now();
      
      const customCode: number = 404;
      const customMessage: string = 'Resource not found.';
      const customData: Record<string, unknown> = {result: customMessage};
      
      const response: CoreApiResponse<unknown> = CoreApiResponse.error(customCode, customMessage, customData);
      
      expect(response.code).toBe(customCode);
      expect(response.message).toBe(customMessage);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(response.data).toEqual(customData);
    });
    
  });
  
});
