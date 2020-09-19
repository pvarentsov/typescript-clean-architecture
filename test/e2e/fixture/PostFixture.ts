import { PostStatus } from '@core/common/enums/PostEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { Media } from '@core/domain/media/entity/Media';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { User } from '@core/domain/user/entity/User';
import { TestingModule } from '@nestjs/testing';
import { MediaFixture } from '@test/e2e/fixture/MediaFixture';
import { v4 } from 'uuid';

export class PostFixture {
  
  constructor(
    private readonly testingModule: TestingModule
  ) {}
  
  public async insertPost(payload: {owner: User, status?: PostStatus, withImage?: boolean}): Promise<Post> {
    const postRepository: PostRepositoryPort = this.testingModule.get(PostDITokens.PostRepository);
    const mediaFixture: MediaFixture = MediaFixture.new(this.testingModule);
    
    const createdAt: Date = new Date(Date.now() - 3000);
    const editedAt: Date = new Date(Date.now() - 1000);
    
    const image: Optional<Media> = payload.withImage
      ? await mediaFixture.insertMedia({ownerId: payload.owner.getId()})
      : undefined;
    
    const post: Post = await Post.new({
      owner      : PostFixture.userToPostOwner(payload.owner),
      title      : v4(),
      image      : image ? PostFixture.mediaToPostImage(image) : undefined,
      content    : v4(),
      status     : payload.status,
      createdAt  : createdAt,
      editedAt   : editedAt,
      publishedAt: payload.status === PostStatus.PUBLISHED ? new Date() : undefined,
    });
    
    await postRepository.addPost(post);
    
    return post;
  }
  
  public static userToPostOwner(user: User): PostOwner {
    const name: string = `${user.getFirstName()} ${user.getLastName()}`;
    return new PostOwner(user.getId(), name, user.getRole());
  }
  
  public static mediaToPostImage(media: Media): PostImage {
    return new PostImage(media.getId(), media.getMetadata().relativePath);
  }
  
  public static new(testingModule: TestingModule): PostFixture {
    return new PostFixture(testingModule);
  }
  
}