import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { CreatePostAdapter } from '@infrastructure/adapter/usecase/post/CreatePostAdapter';
import { FileStorageConfig } from '@infrastructure/config/FileStorageConfig';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { MediaFixture } from '@test/e2e/fixture/MediaFixture';
import { PostFixture } from '@test/e2e/fixture/PostFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Post.Create', () => {
  
  let testServer: TestServer;
  
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);
  
    postRepository = testServer.testingModule.get(PostDITokens.PostRepository);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('POST /posts', () => {
    
    test('When author creates post, expect it returns new post with image', async () => {
      await expectItCreatesPost(UserRole.AUTHOR, testServer, postRepository, userFixture, mediaFixture, {withImage: true});
    });
  
    test('When author creates post, expect it returns new post without image', async () => {
      await expectItCreatesPost(UserRole.AUTHOR, testServer, postRepository, userFixture, mediaFixture);
    });
    
    test('When admin creates post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/posts')
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When guest creates post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/posts')
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });

    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/posts'}, testServer);
    });

    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      await AuthExpect.unauthorizedError({method: 'post', path: '/posts'}, testServer, v4());
    });

    test('When request data is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/posts')
        .send({title: 42, content: 42, imageId: 'not-uuid'})
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);

      expect(response.body.data.context).toBe(CreatePostAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['title', 'imageId', 'content']);

      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
  
    test('When user attaches not existing image, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/posts')
        .send({title: v4(), content: v4(), imageId: v4()})
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
  
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Post image not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
  });
  
});

async function expectItCreatesPost(
  executorRole: UserRole,
  testServer: TestServer,
  postRepository: PostRepositoryPort,
  userFixture: UserFixture,
  mediaFixture: MediaFixture,
  options?: {withImage?: boolean}
  
): Promise<void> {
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
  const postTitle: string = v4();
  const postContent: string = v4();
  
  const postImage: Optional<PostImage> = options?.withImage
    ? PostFixture.mediaToPostImage(await mediaFixture.insertMedia({ownerId: executor.getId()}))
    : undefined;
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post('/posts')
    .send({title: postTitle, content: postContent, imageId: postImage?.getId()})
    .set('x-api-token', accessToken)
    .expect(HttpStatus.OK);
  
  const createdPost: Optional<Post> = await postRepository.findPost({id: response.body.data.id});
  
  const expectedImage: Nullable<Record<string, unknown>> = options?.withImage
    ? {id: postImage!.getId(), url: `${FileStorageConfig.BASE_PATH}/${postImage!.getRelativePath()}`}
    : null;
  
  const expectedPostData: Record<string, unknown> = {
    id         : createdPost!.getId(),
    owner      : PostFixture.userToPostOwner(executor),
    image      : expectedImage,
    title      : postTitle,
    content    : postContent,
    status     : PostStatus.DRAFT,
    createdAt  : createdPost!.getCreatedAt().getTime(),
    editedAt   : null,
    publishedAt: null
  };
  
  expect(createdPost).toBeDefined();
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedPostData);
}