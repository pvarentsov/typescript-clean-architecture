import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Post } from '@core/domain/post/entity/Post';
import { User } from '@core/domain/user/entity/User';
import { GetPostAdapter } from '@infrastructure/adapter/usecase/post/GetPostAdapter';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/.common/TestServer';
import { AuthExpect } from '@test/e2e/expect/AuthExpect';
import { ResponseExpect } from '@test/e2e/expect/ResponseExpect';
import { AuthFixture } from '@test/e2e/fixture/AuthFixture';
import { PostFixture } from '@test/e2e/fixture/PostFixture';
import { UserFixture } from '@test/e2e/fixture/UserFixture';
import * as supertest from 'supertest';
import { v4 } from 'uuid';

describe('Post.Get', () => {
  
  let testServer: TestServer;
  let userFixture: UserFixture;
  let postFixture: PostFixture;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    postFixture = PostFixture.new(testServer.testingModule);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('GET /posts/{postId}', () => {
  
    test('When author requests own draft post, expect it returns post', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor, status: PostStatus.DRAFT, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      const expectedPostData: Record<string, unknown> = {
        id         : post!.getId(),
        owner      : PostFixture.userToPostOwner(executor),
        image      : null,
        title      : post.getTitle(),
        content    : post.getContent(),
        status     : PostStatus.DRAFT,
        createdAt  : post!.getCreatedAt().getTime(),
        editedAt   : post?.getEditedAt()?.getTime() || null,
        publishedAt: null
      };
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
  
    test('When author requests own published post, expect it returns post', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor, status: PostStatus.PUBLISHED, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      const expectedPostData: Record<string, unknown> = {
        id         : post!.getId(),
        owner      : PostFixture.userToPostOwner(executor),
        image      : null,
        title      : post.getTitle(),
        content    : post.getContent(),
        status     : PostStatus.PUBLISHED,
        createdAt  : post!.getCreatedAt().getTime(),
        editedAt   : post?.getEditedAt()?.getTime() || null,
        publishedAt: post?.getPublishedAt()?.getTime(),
      };
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
  
    test('When author requests other people\'s published post, expect it returns post', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.PUBLISHED, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      const expectedPostData: Record<string, unknown> = {
        id         : post!.getId(),
        owner      : PostFixture.userToPostOwner(owner),
        image      : null,
        title      : post.getTitle(),
        content    : post.getContent(),
        status     : PostStatus.PUBLISHED,
        createdAt  : post!.getCreatedAt().getTime(),
        editedAt   : post?.getEditedAt()?.getTime() || null,
        publishedAt: post?.getPublishedAt()?.getTime() || null,
      };
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
  
    test('When admin requests other people\'s published post, expect it returns post', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.PUBLISHED, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      const expectedPostData: Record<string, unknown> = {
        id         : post!.getId(),
        owner      : PostFixture.userToPostOwner(owner),
        image      : null,
        title      : post.getTitle(),
        content    : post.getContent(),
        status     : PostStatus.PUBLISHED,
        createdAt  : post!.getCreatedAt().getTime(),
        editedAt   : post?.getEditedAt()?.getTime() || null,
        publishedAt: post?.getPublishedAt()?.getTime(),
      };
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
  
    test('When guest requests other people\'s published post, expect it returns post', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.PUBLISHED, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      const expectedPostData: Record<string, unknown> = {
        id         : post!.getId(),
        owner      : PostFixture.userToPostOwner(owner),
        image      : null,
        title      : post.getTitle(),
        content    : post.getContent(),
        status     : PostStatus.PUBLISHED,
        createdAt  : post!.getCreatedAt().getTime(),
        editedAt   : post?.getEditedAt()?.getTime() || null,
        publishedAt: post?.getPublishedAt()?.getTime(),
      };
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
    
    test('When author requests other people\'s draft post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.DRAFT, withImage: false});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When admin requests other people\'s draft post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.DRAFT, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When guest requests other people\'s draft post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.DRAFT, withImage: false});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${post.getId()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
    
      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When access token is not passed, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.PUBLISHED, withImage: false});
      
      await AuthExpect.unauthorizedError({method: 'get', path: `/posts/${post.getId()}`}, testServer);
    });
    
    test('When access token is not valid, expect it returns "UNAUTHORIZED_ERROR" response', async () => {
      const owner: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const post: Post = await postFixture.insertPost({owner: owner, status: PostStatus.PUBLISHED, withImage: false});
      
      await AuthExpect.unauthorizedError({method: 'get', path: `/posts/${post.getId()}`}, testServer, v4());
    });
    
    test('When user requests not existing post, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/posts/${v4()}`)
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Post not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
    test('When request id is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/posts/not-uuid')
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);
      
      expect(response.body.data.context).toBe(GetPostAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['postId']);
      
      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
    
  });
  
});