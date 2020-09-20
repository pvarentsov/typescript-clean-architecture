import { HttpJwtPayload } from '@application/api/http-rest/auth/type/HttpAuthTypes';
import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { User } from '@core/domain/user/entity/User';
import { ApiServerConfig } from '@infrastructure/config/ApiServerConfig';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import { verify } from 'jsonwebtoken';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Auth', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('POST /auth/login', () => {
    
    test('When credentials are correct, expect user successfully log in', async () => {
      const role: UserRole = UserRole.AUTHOR;
      const email: string = `${v4()}@email.com`;
      const password: string = v4();
      
      const user: User = await userFixture.insertUser({role, email, password});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/auth/login')
        .send({email, password})
        .expect(HttpStatus.OK);
  
      const tokenPayload: HttpJwtPayload = await verify(response.body.data.accessToken, ApiServerConfig.ACCESS_TOKEN_SECRET) as HttpJwtPayload;
  
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body, passFields: ['id']}, {id: user.getId()});

      expect(tokenPayload.id).toBe(user.getId());
    });
  
    test('When email is not correct, expect it returns "WRONG_CREDENTIALS_ERROR" response', async () => {
      const email: string = `${v4()}@email.com`;
      const password: string = v4();
    
      await expectWrongCredentialsOnLogin(
        {email: email, password: password},
        {email: `${v4()}@email.com`, password: password},
        testServer,
        userFixture,
      );
    });
  
    test('When password is not correct, expect it returns "WRONG_CREDENTIALS_ERROR" response', async () => {
      const email: string = `${v4()}@email.com`;
      const password: string = v4();
  
      await expectWrongCredentialsOnLogin(
        {email: email, password: password},
        {email: email, password: v4()},
        testServer,
        userFixture,
      );
    });
    
  });
  
});

async function expectWrongCredentialsOnLogin(
  correctCredentials: {email: string, password: string},
  wrongCredentials: {email: string, password: string},
  testServer: TestServer,
  userFixture: UserFixture
  
): Promise<void> {
  
  await userFixture.insertUser({role: UserRole.GUEST, email: correctCredentials.email, password: correctCredentials.password});
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post('/auth/login')
    .send(wrongCredentials)
    .expect(HttpStatus.OK);
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.WRONG_CREDENTIALS_ERROR.code, message: Code.WRONG_CREDENTIALS_ERROR.message});
  ResponseExpect.data({response: response.body}, null);
}