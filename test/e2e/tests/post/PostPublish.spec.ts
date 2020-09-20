import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { PublishPostAdapter } from '@infrastructure/adapter/usecase/post/PublishPostAdapter';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { PostFixture } from '@test/e2e/fixture/PostFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Post.Publish', () => {
  
  let testServer: TestServer;
  
  let userFixture: UserFixture;
  let postFixture: PostFixture;
  
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    postFixture = PostFixture.new(testServer.testingModule);
  
    postRepository = testServer.testingModule.get(PostDITokens.PostRepository);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('POST /posts/{postId}/publish', () => {
  
    test('When author publishes post, expect it returns published post and attaches image', async () => {
      await expectItPublishesPost(UserRole.AUTHOR, testServer, postRepository, userFixture, postFixture);
    });
  
    test('When admin publishes post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post(`/posts/${post.getId()}/publish`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When guest publishes post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post(`/posts/${post.getId()}/publish`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner});
    
      await AuthExpect.unauthorizedError({method: 'put', path: `/posts/${post.getId()}`}, testServer);
    });
  
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner});
    
      await AuthExpect.unauthorizedError({method: 'put', path: `/posts/${post.getId()}`}, testServer, v4());
    });
  
    test('When request id is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/posts/$not-uuid/publish')
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      expect(response.body.data.context).toBe(PublishPostAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['postId']);
    
      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message
      });
    });
    
  });
});

async function expectItPublishesPost(
  executorRole: UserRole,
  testServer: TestServer,
  postRepository: PostRepositoryPort,
  userFixture: UserFixture,
  postFixture: PostFixture,
  
): Promise<void> {
  
  const currentDate: number = Date.now();
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
  const post: Post = await postFixture.insertPost({owner: executor, status: PostStatus.DRAFT});
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post(`/posts/${post.getId()}/publish`)
    .set('x-api-token', accessToken)
    .expect(HttpStatus.OK);
  
  const publishedPost: Optional<Post> = await postRepository.findPost({id: response.body.data.id});
  
  const expectedPostData: Record<string, unknown> = {
    id         : publishedPost!.getId(),
    owner      : PostFixture.userToPostOwner(executor),
    image      : null,
    title      : publishedPost!.getTitle(),
    content    : publishedPost!.getContent(),
    status     : PostStatus.PUBLISHED,
    createdAt  : publishedPost!.getCreatedAt().getTime(),
    editedAt   : publishedPost!.getEditedAt()!.getTime(),
    publishedAt: publishedPost!.getPublishedAt()!.getTime(),
  };
  
  expect(publishedPost!.getPublishedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate);
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedPostData);
}