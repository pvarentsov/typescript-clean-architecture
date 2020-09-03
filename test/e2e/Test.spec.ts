import { ServerApplicationFixture, ServerApplicationFixtures } from '@test/.common/fixture/ServerApplicationFixture';

describe('DB Test', () => {
  
  describe('Connect', () => {
  
    let fixtures: ServerApplicationFixtures;
    
    beforeAll(async () => {
      fixtures = await ServerApplicationFixture.new();
      await fixtures.serverApplication.init();
    });
    
    test('Expect it successfully connects to DB', async () => {
      const result: string = await fixtures.dbConnection.query('SELECT true as result');
      expect(result).toEqual([{result: true}]);
    });
  
    afterAll(async () => {
      if (fixtures) {
        await fixtures.serverApplication.close();
      }
    });
    
  });
  
});
