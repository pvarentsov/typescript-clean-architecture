import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { User } from '@core/domain/user/entity/User';
import { RemovePostAdapter } from '@infrastructure/adapter/usecase/post/RemovePostAdapter';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { PostFixture } from '@test/e2e/fixture/PostFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Post.Remove', () => {
  
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
  
  describe('DELETE /posts/{postId}', () => {
    
    test('When author removes post, expect it removes post', async () => {
      await expectItRemovesPost(UserRole.AUTHOR, testServer, postRepository, userFixture, postFixture);
    });
  
    test('When admin removes post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/posts/${post.getId()}`)
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When guest removes post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
      const post: Post = await postFixture.insertPost({owner: executor});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/posts/${post.getId()}`)
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When user removes other people\'s post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: executor});
      
      await AuthExpect.unauthorizedError({method: 'delete', path: `/posts/${post.getId()}`}, testServer);
    });
    
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: executor});
      
      await AuthExpect.unauthorizedError({method: 'delete', path: `/posts/${post.getId()}`}, testServer, v4());
    });
  
    test('When user removes not existing post, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .delete(`/posts/${v4()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Post not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When request id is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .delete('/posts/not-uuid')
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      expect(response.body.data.context).toBe(RemovePostAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['postId']);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
});

async function expectItRemovesPost(
  executorRole: UserRole,
  testServer: TestServer,
  postRepository: PostRepositoryPort,
  userFixture: UserFixture,
  postFixture: PostFixture

): Promise<void> {
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
  const post: Post = await postFixture.insertPost({owner: executor, status: PostStatus.PUBLISHED});
  
  const removeResponse: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .delete(`/posts/${post.getId()}`)
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  const getResponse: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .get(`/posts/${v4()}`)
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  const getListResponse: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .get('/posts')
    .set('x-api-token', auth.accessToken)
    .expect(HttpStatus.OK);
  
  ResponseExpect.codeAndMessage(removeResponse.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: removeResponse.body}, null);
  
  ResponseExpect.codeAndMessage(getResponse.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Post not found.'});
  ResponseExpect.data({response: getResponse.body}, null);
  
  ResponseExpect.codeAndMessage(getListResponse.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  expect(getListResponse.body.data.filter((item: PostUseCaseDto) => item.id === post.getId())).toEqual([]);
}