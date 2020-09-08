import { ServerTestApplication } from '@test/.common/ServerTestApplication';

describe('DB Test', () => {
  
  describe('Connect', () => {
  
    let serverApplication: ServerTestApplication;
    
    beforeAll(async () => {
      serverApplication = await ServerTestApplication.new();
      await serverApplication.serverApplication.init();
    });
    
    test('Expect it successfully connects to DB', async () => {
      const result: string = await serverApplication.dbConnection.query('SELECT true as "isConnected"');
      expect(result).toEqual([{isConnected: true}]);
    });
  
    afterAll(async () => {
      if (serverApplication) {
        await serverApplication.serverApplication.close();
      }
    });
    
  });
  
});
