import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Media } from '@core/domain/media/entity/Media';
import { User } from '@core/domain/user/entity/User';
import { GetMediaAdapter } from '@infrastructure/adapter/usecase/media/GetMediaAdapter';
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

describe('Media.Get', () => {
  
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
  
  describe('GET /medias/{mediaId}', () => {
    
    test('When admin requests own media, expect it returns media', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const { accessToken } = await AuthFixture.loginUser({id: executor.getId()});
  
      const media: Media = await mediaFixture.insertMedia({ownerId: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      const expectedData: Record<string, unknown> = {
        id       : media!.getId(),
        ownerId  : executor.getId(),
        name     : media.getName(),
        type     : MediaType.IMAGE,
        url      : `${FileStorageConfig.BASE_PATH}/${media!.getMetadata().relativePath}`,
        createdAt: media!.getCreatedAt().getTime(),
        editedAt : media!.getEditedAt()!.getTime(),
      };
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedData);
    });
  
    test('When author requests own media, expect it returns media', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const { accessToken } = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId: executor.getId()});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
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
      ResponseExpect.data({response: response.body}, expectedMediaData);
    });
  
    test('When guest requests media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const { accessToken } = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId: executor.getId()});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When author requests other people\'s media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const ownerId: string = v4();
    
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When admin requests other people\'s media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const ownerId: string = v4();
    
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When gust requests other people\'s media, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const ownerId: string = v4();
    
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const media: Media = await mediaFixture.insertMedia({ownerId});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({method: 'get', path: `/medias/${media.getId()}`}, testServer);
    });
    
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({method: 'get', path: `/medias/${media.getId()}`}, testServer, v4());
    });
    
    test('When user requests not existing media, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${v4()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Media not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When request id is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias/not-uuid')
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      expect(response.body.data.context).toBe(GetMediaAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['mediaId']);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
});