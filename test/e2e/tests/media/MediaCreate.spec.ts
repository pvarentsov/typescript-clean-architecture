import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { CreateMediaAdapter } from '@infrastructure/adapter/usecase/media/CreateMediaAdapter';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { e2eAssetDirectory } from '@test/e2e/asset/E2EAssetDirectory';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as fs from 'fs';
import * as path from 'path';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Media.Create', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
  
    mediaRepository = testServer.testingModule.get(MediaDITokens.MediaRepository);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('POST /medias', () => {
    
    test('When admin creates media, expect it returns new media', async () => {
      await expectItCreatesMedia(UserRole.ADMIN, testServer, mediaRepository, userFixture);
    });
  
    test('When author creates media, expect it returns new media', async () => {
      await expectItCreatesMedia(UserRole.AUTHOR, testServer, mediaRepository, userFixture);
    });
    
    test('When guest creates media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/medias')
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/medias'}, testServer);
    });
  
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/medias'}, testServer, v4());
    });
  
    test('When request data is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const filePath: string = path.resolve(e2eAssetDirectory, 'content/cat.png');
      
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const invalidMediaType: string = 'INVALID_MEDIA_TYPE';
  
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/medias')
        .attach('file', filePath)
        .query({type: invalidMediaType})
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      expect(response.body.data.context).toBe(CreateMediaAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['type']);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
});

async function expectItCreatesMedia(
  executorRole: UserRole,
  testServer: TestServer,
  mediaRepository: MediaRepositoryPort,
  userFixture: UserFixture
  
): Promise<void> {
  
  const filePath: string = path.resolve(e2eAssetDirectory, 'content/cat.png');
  
  const executorEmail: string = `${v4()}@email.com`;
  const executorPassword: string = v4();
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: executorEmail, password: executorPassword});
  const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
  const mediaName: string = 'New File';
  const mediaType: MediaType = MediaType.IMAGE;
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post('/medias')
    .attach('file', filePath)
    .query({name: mediaName, type: mediaType})
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  const createdMedia: Optional<Media> = await mediaRepository.findMedia({id: response.body.data.id});
  
  const expectedMediaData: Record<string, unknown> = {
    id       : createdMedia!.getId(),
    ownerId  : executor.getId(),
    name     : mediaName,
    type     : mediaType,
    url      : `${FileStorageConfig.BASE_PATH}/${createdMedia!.getMetadata().relativePath}`,
    createdAt: createdMedia!.getCreatedAt().getTime(),
    editedAt : null
  };
  
  expect(createdMedia).toBeDefined();
  expect(createdMedia!.getMetadata().size).toBe(fs.readFileSync(filePath).length);
  expect(createdMedia!.getMetadata().mimetype).toBe('image/png');
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedMediaData);
}