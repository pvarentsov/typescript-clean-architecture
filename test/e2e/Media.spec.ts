import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { HttpStatus } from '@nestjs/common';
import { e2eAssetDirectory } from '@test/e2e/asset/E2EAssetDirectory';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as fs from 'fs';
import * as path from 'path';
import * as supertest from 'supertest';
import { v4 } from 'uuid';
import { TestServer } from '../.common/TestServer';

describe('User', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);
  
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
  
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/medias'}, testServer);
    });
  
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/medias'}, testServer, v4());
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