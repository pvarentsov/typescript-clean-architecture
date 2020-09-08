import { HttpJwtPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { User } from '@core/domain/user/entity/User';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { HttpStatus } from '@nestjs/common';
import { UserFixture } from '@test/e2e/.fixture/UserFixture';
import * as supertest from 'supertest';
import { verify } from 'jsonwebtoken';
import { v4 } from 'uuid';
import { TestServer } from '../../.common/TestServer';

describe('Auth', () => {
  
  describe('POST /auth/login', () => {
    
    let testServer: TestServer;
    let userFixture: UserFixture;
    
    beforeAll(async () => {
      testServer = await TestServer.new();
      userFixture = UserFixture.new(testServer.testingModule);
      
      await testServer.serverApplication.init();
    });
    
    test('When credentials are correct, expect it successfully login user', async () => {
      const currentDate: number = Date.now();
      
      const role: UserRole = UserRole.AUTHOR;
      const email: string = `${v4()}@email.com`;
      const password: string = v4();
      
      const user: User = await userFixture.insertUser({role, email, password});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/auth/login')
        .send({email, password})
        .expect(HttpStatus.OK);
  
      const tokenPayload: HttpJwtPayload = await verify(response.body.data.accessToken, ApiServerConfig.ACCESS_TOKEN_SECRET) as HttpJwtPayload;
      
      expect(response.body.code).toBe(Code.SUCCESS.code);
      expect(response.body.message).toBe(Code.SUCCESS.message);
      expect(response.body.timestamp).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(response.body.data.id).toBe(user.getId());
      expect(tokenPayload.id).toBe(user.getId());
    });
    
    afterAll(async () => {
      if (testServer) {
        await testServer.serverApplication.close();
      }
    });
    
  });
  
});