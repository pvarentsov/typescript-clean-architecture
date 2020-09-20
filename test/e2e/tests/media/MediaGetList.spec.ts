import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Media } from '@core/domain/media/entity/Media';
import { User } from '@core/domain/user/entity/User';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { MediaFixture } from '@test/e2e/fixture/MediaFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Media.GetList', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('GET /medias', () => {
    
    test('When admin requests media, expect it returns media list response', async () => {
      await expectItReturnsMediaList(UserRole.ADMIN, testServer, userFixture, mediaFixture);
    });
  
    test('When author requests media, expect it returns media list response', async () => {
      await expectItReturnsMediaList(UserRole.AUTHOR, testServer, userFixture, mediaFixture);
    });
  
    test('When guest requests media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const { accessToken } = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias')
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'get', path: '/medias'}, testServer);
    });
    
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'get', path: '/medias'}, testServer, v4());
    });
    
    test('When user requests not existing media, expect it returns empty array', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias')
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, []);
    });
    
  });
  
});

async function expectItReturnsMediaList(
  executorRole: UserRole,
  testServer: TestServer,
  userFixture: UserFixture,
  mediaFixture: MediaFixture
  
): Promise<void> {
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const { accessToken } = await AuthFixture.loginUser({id: executor.getId()});
  
  const media: Media = await mediaFixture.insertMedia({ownerId: executor.getId()});
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .get('/medias')
    .set('x-api-token', accessToken)
    .expect(HttpStatus.OK);
  
  const expectedMediaData: Record<string, unknown> = {
    id       : media!.getId(),
    ownerId  : executor.getId(),
    name     : media.getName(),
    type     : MediaType.IMAGE,
    url      : `${FileStorageConfig.BASE_PATH}/${media!.getMetadata().relativePath}`,
    createdAt: media!.getCreatedAt().getTime(),
    editedAt : media!.getEditedAt()!.getTime(),
  };
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, [expectedMediaData]);
}