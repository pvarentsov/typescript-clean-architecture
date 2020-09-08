import { TestServer } from '../.common/TestServer';

describe('DB Test', () => {
  
  describe('Connect', () => {
  
    let serverApplication: TestServer;
    
    beforeAll(async () => {
      serverApplication = await TestServer.new();
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
