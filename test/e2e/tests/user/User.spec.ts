import { HttpRestApiModelCreateUserBody } from '@application/api/http-rest/controller/documentation/user/HttpRestApiModelCreateUserBody';
import { Code } from '@core/common/code/Code';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { CreateUserAdapter } from '@infrastructure/adapter/usecase/user/CreateUserAdapter';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('User', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  
  let userRepository: UserRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);
    
    userRepository = testServer.testingModule.get(UserDITokens.UserRepository);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('POST /users/account', () => {
    
    test('Expect it creates guest account', async () => {
      await expectItCreatesAccount(UserRole.GUEST, testServer, userRepository);
    });
  
    test('Expect it creates author account', async () => {
      await expectItCreatesAccount(UserRole.AUTHOR, testServer, userRepository);
    });
  
    test('When user already exists, expect it returns "ENTITY_ALREADY_EXISTS_ERROR" response', async () => {
      const body: HttpRestApiModelCreateUserBody = {
        firstName  : v4(),
        lastName   : v4(),
        email      : `${v4()}@email.com`,
        role       : UserRole.AUTHOR,
        password   : v4(),
      };
  
      await userFixture.insertUser({role: body.role, email: body.email, password: body.password});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/account')
        .send(body)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_ALREADY_EXISTS_ERROR.code, message: 'User already exists.'});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When body is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const body: Record<string, unknown> = {
        firstName  : 1337,
        lastName   : null,
        email      : 'not email',
        role       : UserRole.ADMIN,
        password   : 42,
      };
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/account')
        .send(body)
        .expect(HttpStatus.OK);
    
      expect(response.body.data.context).toBe(CreateUserAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['firstName', 'lastName', 'email', 'role', 'password']);
  
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
  describe('GET /users/me', () => {
    
    test('Expect it returns guest account', async () => {
      await expectItReturnsUserAccount(UserRole.GUEST, testServer, userFixture);
    });
  
    test('Expect it returns author account', async () => {
      await expectItReturnsUserAccount(UserRole.AUTHOR, testServer, userFixture);
    });
  
    test('Expect it returns admin account', async () => {
      await expectItReturnsUserAccount(UserRole.ADMIN, testServer, userFixture);
    });
  
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'get', path: '/users/me'}, testServer);
    });
  
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'get', path: '/users/me'}, testServer, v4());
    });
    
  });
  
});

async function expectItCreatesAccount(role: UserRole, testServer: TestServer, userRepository: UserRepositoryPort): Promise<void> {
  const body: HttpRestApiModelCreateUserBody = {
    firstName  : v4(),
    lastName   : v4(),
    email      : `${v4()}@email.com`,
    role       : role,
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
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedData);
}

async function expectItReturnsUserAccount(userRole: UserRole, testServer: TestServer, userFixture: UserFixture): Promise<void> {
  const role: UserRole = userRole;
  const email: string = `${v4()}@email.com`;
  const password: string = v4();
  
  const user: User = await userFixture.insertUser({role, email, password});
  const auth: {accessToken: string} = await AuthFixture.loginUser({id: user.getId()});
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .get('/users/me')
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  const expectedData: Record<string, unknown> = {
    id       : user.getId(),
    firstName: user.getFirstName(),
    lastName : user.getLastName(),
    email    : user.getEmail(),
    role     : user.getRole()
  };
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedData);
}