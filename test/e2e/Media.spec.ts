import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { CreateMediaAdapter } from '@infrastructure/adapter/usecase/media/CreateMediaAdapter';
import { EditMediaAdapter } from '@infrastructure/adapter/usecase/media/EditMediaAdapter';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { HttpStatus } from '@nestjs/common';
import { e2eAssetDirectory } from '@test/e2e/asset/E2EAssetDirectory';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { MediaFixture } from '@test/e2e/fixture/MediaFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as fs from 'fs';
import * as path from 'path';
import * as supertest from 'supertest';
import { v4 } from 'uuid';
import { TestServer } from '../.common/TestServer';

describe('User', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);
  
    mediaRepository = testServer.testingModule.get(MediaDITokens.MediaRepository);
    
    await testServer.serverApplication.init();
  });
  
  describe('POST /medias', () => {
    
    test('When owner is admin, expect it creates media', async () => {
      await expectItCreatesMedia(UserRole.ADMIN, testServer, mediaRepository, userFixture);
    });
  
    test('When owner is author, expect it creates media', async () => {
      await expectItCreatesMedia(UserRole.AUTHOR, testServer, mediaRepository, userFixture);
    });
    
    test('When owner is guest, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
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
  
  describe('PUT /medias/{mediaId}', () => {
    
    test('When owner is admin, expect it edits media', async () => {
      await expectItEditsMedia(UserRole.ADMIN, testServer, mediaRepository, userFixture, mediaFixture);
    });
    
    test('When owner is author, expect it edits media', async () => {
      await expectItEditsMedia(UserRole.AUTHOR, testServer, mediaRepository, userFixture, mediaFixture);
    });
    
    test('When owner is guest, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
      const media: Media = await mediaFixture.insertMedia();
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/medias/${media.getId()}`)
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When user try to edit other people\'s media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const ownerId: string = v4();
      
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({method: 'put', path: `/medias/${media.getId()}`}, testServer);
    });
    
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({method: 'put', path: `/medias/${media.getId()}`}, testServer, v4());
    });
  
    test('When user try to edit not existing media, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/medias/${v4()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Media not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When request data is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const invalidNameType: number = 42;
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put('/medias/not-uuid')
        .send({name: invalidNameType})
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      expect(response.body.data.context).toBe(EditMediaAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['mediaId', 'name']);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
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
  
  const expectedData: Record<string, unknown> = {
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
  ResponseExpect.data({response: response.body}, expectedData);
}

async function expectItEditsMedia(
  executorRole: UserRole,
  testServer: TestServer,
  mediaRepository: MediaRepositoryPort,
  userFixture: UserFixture,
  mediaFixture: MediaFixture

): Promise<void> {
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
  const media: Media = await mediaFixture.insertMedia({ownerId: executor.getId()});
  const newName: string = v4();
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .put(`/medias/${media.getId()}`)
    .send({name: newName})
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  const editedMedia: Optional<Media> = await mediaRepository.findMedia({id: media.getId()});
  
  const expectedData: Record<string, unknown> = {
    id       : media!.getId(),
    ownerId  : executor.getId(),
    name     : newName,
    type     : MediaType.IMAGE,
    url      : `${FileStorageConfig.BASE_PATH}/${media!.getMetadata().relativePath}`,
    createdAt: media!.getCreatedAt().getTime(),
    editedAt : editedMedia!.getEditedAt()!.getTime(),
  };
  
  expect(editedMedia!.getName()).toBe(newName);
  expect(editedMedia!.getEditedAt()!.getTime()).toBeGreaterThan(media!.getEditedAt()!.getTime());
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedData);
}