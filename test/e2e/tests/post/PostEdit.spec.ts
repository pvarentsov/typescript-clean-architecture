import { Code } from '@core/common/code/Code';
import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Nullable, Optional } from '@core/common/type/CommonTypes';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { EditPostAdapter } from '@infrastructure/adapter/usecase/post/EditPostAdapter';
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

describe('Post.Edit', () => {
  
  let testServer: TestServer;
  
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  let postFixture: PostFixture;
  
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    testServer = await TestServer.new();
    
    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);
    postFixture = PostFixture.new(testServer.testingModule);
  
    postRepository = testServer.testingModule.get(PostDITokens.PostRepository);
    
    await testServer.serverApplication.init();
  });
  
  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });
  
  describe('PUT /posts/{postId}', () => {
    
    test('When author edits post, expect it returns edited post and attaches image', async () => {
      await expectItEditsPost(UserRole.AUTHOR, testServer, postRepository, userFixture, mediaFixture, postFixture, {
        hasOriginalPostAttachedImage: false
      });
    });
  
    test('When author edits post, expect it returns edited post and attaches another image ', async () => {
      await expectItEditsPost(UserRole.AUTHOR, testServer, postRepository, userFixture, mediaFixture, postFixture, {
        hasOriginalPostAttachedImage: true
      });
    });
  
    test('When author edits post, expect it returns edited post and reset image ', async () => {
      await expectItEditsPost(UserRole.AUTHOR, testServer, postRepository, userFixture, mediaFixture, postFixture, {
        hasOriginalPostAttachedImage: true,
        resetImage: true
      });
    });
    
    test('When admin edits post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.ADMIN, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
      const post: Post = await postFixture.insertPost({owner: executor});

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/posts/${post.getId()}`)
        .set('x-api-token', auth.accessToken)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, {code: Code.ACCESS_DENIED_ERROR.code, message: Code.ACCESS_DENIED_ERROR.message});
      ResponseExpect.data({response: response.body}, null);
    });
  
    test('When guest edits post, expect it returns "ACCESS_DENIED_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.GUEST, email: `${v4()}@email.com`, password: v4()});
      const auth: {accessToken: string} = await AuthFixture.loginUser({id: executor.getId()});
  
      const post: Post = await postFixture.insertPost({owner: executor});
  
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/posts/${post.getId()}`)
        .set('x-api-token', auth.accessToken)
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

    test('When request data is not valid, expect it returns "USE_CASE_PORT_VALIDATION_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
      const post: Post = await postFixture.insertPost({owner: executor});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/posts/${post.getId()}`)
        .send({title: 42, content: 42, imageId: 'not-uuid'})
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);

      expect(response.body.data.context).toBe(EditPostAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['title', 'imageId', 'content']);

      ResponseExpect.codeAndMessage(response.body, {code: Code.USE_CASE_PORT_VALIDATION_ERROR.code, message: Code.USE_CASE_PORT_VALIDATION_ERROR.message});
    });
  
    test('When request data is empty, expect it does not edit post ', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
    
      const post: Post = await postFixture.insertPost({owner: executor});
    
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/posts/${post.getId()}`)
        .send({title: undefined, content: undefined, imageId: undefined})
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
  
      const editedPost: Optional<Post> = await postRepository.findPost({id: response.body.data.id});
  
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
  
      expect(editedPost).toEqual(post);
  
      ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
      ResponseExpect.data({response: response.body}, expectedPostData);
    });
  
    test('When user attaches not existing image, expect it returns "ENTITY_NOT_FOUND_ERROR" response', async () => {
      const executor: User = await userFixture.insertUser({role: UserRole.AUTHOR, email: `${v4()}@email.com`, password: v4()});
      const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
      const post: Post = await postFixture.insertPost({owner: executor});
      
      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .put(`/posts/${post.getId()}`)
        .send({title: v4(), content: v4(), imageId: v4()})
        .set('x-api-token', accessToken)
        .expect(HttpStatus.OK);
  
      ResponseExpect.codeAndMessage(response.body, {code: Code.ENTITY_NOT_FOUND_ERROR.code, message: 'Post image not found.'});
      ResponseExpect.data({response: response.body}, null);
    });
    
  });
  
});

async function expectItEditsPost(
  executorRole: UserRole,
  testServer: TestServer,
  postRepository: PostRepositoryPort,
  userFixture: UserFixture,
  mediaFixture: MediaFixture,
  postFixture: PostFixture,
  options?: {hasOriginalPostAttachedImage?: boolean, resetImage?: boolean}
  
): Promise<void> {
  
  const executor: User = await userFixture.insertUser({role: executorRole, email: `${v4()}@email.com`, password: v4()});
  const {accessToken} = await AuthFixture.loginUser({id: executor.getId()});
  
  const post: Post = await postFixture.insertPost({owner: executor, withImage: options?.hasOriginalPostAttachedImage});
  
  const newTitle: string = v4();
  const newContent: string = v4();
  
  const newImage: Nullable<PostImage> = options?.resetImage
    ? null
    : PostFixture.mediaToPostImage(await mediaFixture.insertMedia({ownerId: executor.getId()}));
  
  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .put(`/posts/${post.getId()}`)
    .send({title: newTitle, content: newContent, imageId: newImage?.getId() || null})
    .set('x-api-token', accessToken)
    .expect(HttpStatus.OK);
  
  const editedPost: Optional<Post> = await postRepository.findPost({id: response.body.data.id});
  
  const expectedImage: Nullable<Record<string, unknown>> = options?.resetImage
    ? null
    : {id: newImage!.getId(), url: `${FileStorageConfig.BASE_PATH}/${newImage!.getRelativePath()}`};
  
  const expectedPostData: Record<string, unknown> = {
    id         : editedPost!.getId(),
    owner      : PostFixture.userToPostOwner(executor),
    image      : expectedImage,
    title      : newTitle,
    content    : newContent,
    status     : PostStatus.DRAFT,
    createdAt  : editedPost!.getCreatedAt().getTime(),
    editedAt   : editedPost!.getEditedAt()!.getTime(),
    publishedAt: null
  };
  
  expect(editedPost).toBeDefined();
  
  ResponseExpect.codeAndMessage(response.body, {code: Code.SUCCESS.code, message: Code.SUCCESS.message});
  ResponseExpect.data({response: response.body}, expectedPostData);
}