import { HttpRestApiModelCreateUserBody } from '@application/api/http-rest/controller/documentation/user/HttpRestApiModelCreateUserBody';
import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { HttpStatus } from '@nestjs/common';
import { ExpectTest } from '@test/.common/ExpectTest';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';
import { TestServer } from '../.common/TestServer';

describe('User', () => {
  
  describe('POST /users/account', () => {
    
    let testServer: TestServer;
    let userFixture: UserFixture;
    
    let userRepository: UserRepositoryPort;
    
    beforeAll(async () => {
      testServer = await TestServer.new();
      userFixture = UserFixture.new(testServer.testingModule);
  
      userRepository = testServer.testingModule.get(UserDITokens.UserRepository);
      
      await testServer.serverApplication.init();
    });
    
    test('Expect it creates user account', async () => {
      const body: HttpRestApiModelCreateUserBody = {
        firstName  : v4(),
        lastName   : v4(),
        email      : `${v4()}@email.com`,
        role       : UserRole.GUEST,
        password   : v4(),
      };
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/account')
        .send(body)
        .expect(HttpStatus.OK);
  
      const createdUser: Optional<User> = await userRepository.findUser({email: body.email});
  
      const expectedData: Record<string, unknown> = {
        id       : createdUser!.getId(),
        firstName: body.firstName,
        lastName : body.lastName,
        email    : body.email,
        role     : body.role
      };
      
      expect(createdUser).toBeDefined();
      ExpectTest.expectResponseCodeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ExpectTest.expectResponseData({response: response.body, passFields: ['id', 'firstName', 'lastName', 'email', 'role']}, expectedData);
    });
    
    afterAll(async () => {
      if (testServer) {
        await testServer.serverApplication.close();
      }
    });
    
  });
  
});