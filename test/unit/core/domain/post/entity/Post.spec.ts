import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { CreatePostEntityPayload } from '@core/domain/post/entity/type/CreatePostEntityPayload';
import { v4 } from 'uuid';

describe('Post', () => {
  
  describe('new', () => {
    
    test('When input optional args are empty, expect it creates Post instance with default parameters', async () => {
      const currentDate: number = Date.now();
      
      const postOwnerId: string = v4();
      const postOwnerName: string = v4();
      const postOwnerRole: UserRole = UserRole.AUTHOR;
      
      const createPostEntityPayload: CreatePostEntityPayload = {
        owner: await PostOwner.new(postOwnerId, postOwnerName, postOwnerRole),
        title: 'Post title',
      };
      
      const post: Post = await Post.new(createPostEntityPayload);
      
      const expectedPostOwner: Record<string, unknown> = {id: postOwnerId, name: postOwnerName, role: postOwnerRole};
  
      expect(typeof post.getId() === 'string').toBeTruthy();
      expect(post.getOwner()).toEqual(expectedPostOwner);
      expect(post.getTitle()).toBe(createPostEntityPayload.title);
      expect(post.getImage()).toBeNull();
      expect(post.getContent()).toBeNull();
      expect(post.getStatus()).toBe(PostStatus.DRAFT);
      expect(post.getCreatedAt().getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(post.getEditedAt()).toBeNull();
      expect(post.getPublishedAt()).toBeNull();
      expect(post.getRemovedAt()).toBeNull();
    });
  
    test('When input optional args are set, expect it creates Post instance with custom parameters', async () => {
      const postOwnerId: string = v4();
      const postOwnerName: string = v4();
      const postOwnerRole: UserRole = UserRole.AUTHOR;
  
      const imageId: string = v4();
      const relativePath: string = '/relative/path';
      
      const customId: string = v4();
      const customContent: string = v4();
      const customStatus: PostStatus = PostStatus.PUBLISHED;
      const customCreatedAt: Date = new Date(Date.now() - 4000);
      const customEditedAt: Date = new Date(Date.now() - 3000);
      const customPublishedAt: Date = new Date(Date.now() - 2000);
      const customRemovedAt: Date = new Date(Date.now() - 1000);
  
      const createPostEntityPayload: CreatePostEntityPayload = {
        owner      : await PostOwner.new(postOwnerId, postOwnerName, postOwnerRole),
        title      : 'Post title',
        image      : await PostImage.new(imageId, relativePath),
        content    : customContent,
        id         : customId,
        status     : customStatus,
        createdAt  : customCreatedAt,
        editedAt   : customEditedAt,
        publishedAt: customPublishedAt,
        removedAt  : customRemovedAt
      };
    
      const post: Post = await Post.new(createPostEntityPayload);
  
      const expectedPostOwner: Record<string, unknown> = {id: postOwnerId, name: postOwnerName, role: postOwnerRole};
      const expectedPostImage: Record<string, unknown> = {id: imageId, relativePath: relativePath};
  
      expect(post.getId()).toBe(customId);
      expect(post.getOwner()).toEqual(expectedPostOwner);
      expect(post.getTitle()).toBe(createPostEntityPayload.title);
      expect(post.getImage()).toEqual(expectedPostImage);
      expect(post.getContent()).toBe(customContent);
      expect(post.getStatus()).toBe(customStatus);
      expect(post.getCreatedAt()).toBe(customCreatedAt);
      expect(post.getEditedAt()).toBe(customEditedAt);
      expect(post.getPublishedAt()).toBe(customPublishedAt);
      expect(post.getRemovedAt()).toBe(customRemovedAt);
    });
    
  });
  
  describe('edit', () => {
    
    test('When input args are empty, expect it doesn\'t edit Post instance', async () => {
      const post: Post = await Post.new({
        owner: await PostOwner.new(v4(), v4(), UserRole.AUTHOR),
        title: 'Post title',
      });
  
      await post.edit({});
      
      expect(post.getTitle()).toBe('Post title');
      expect(post.getImage()).toBeNull();
      expect(post.getEditedAt()).toBeNull();
    });
  
    test('When input args are set, expect it edits Post instance', async () => {
      const currentDate: number = Date.now();
      
      const post: Post = await Post.new({
        owner: await PostOwner.new(v4(), v4(), UserRole.ADMIN),
        title: 'Post title',
      });
    
      const newPostImage: PostImage = await PostImage.new(v4(), '/new/relative/path');
      await post.edit({title: 'New Post title', image: newPostImage});
      
      expect(post.getTitle()).toBe('New Post title');
      expect(post.getImage()).toEqual(newPostImage);
      expect(post.getEditedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
  describe('publish', () => {
    
    test('Expect it marks Post instance as published', async () => {
      const currentDate: number = Date.now();
      
      const post: Post = await Post.new({
        owner: await PostOwner.new(v4(), v4(), UserRole.GUEST),
        title: 'Post title',
      });
      
      await post.publish();
  
      expect(post.getStatus()).toBe(PostStatus.PUBLISHED);
      expect(post.getEditedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(post.getPublishedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
  describe('remove', () => {
    
    test('Expect it marks Post instance as removed', async () => {
      const currentDate: number = Date.now();
  
      const postOwnerId: string = v4();
      const postOwnerName: string = v4();
      const postOwnerRole: UserRole = UserRole.AUTHOR;
  
      const post: Post = await Post.new({
        owner: await PostOwner.new(postOwnerId, postOwnerName, postOwnerRole),
        title: 'Post title',
      });
      
      await post.remove();
      
      expect(post.getRemovedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
});
