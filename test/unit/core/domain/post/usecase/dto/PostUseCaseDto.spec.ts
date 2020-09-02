import { PostStatus } from '@core/common/enums/PostEnums';
import { UserRole } from '@core/common/enums/UserEnums';
import { Post } from '@core/domain/post/entity/Post';
import { PostImage } from '@core/domain/post/entity/PostImage';
import { PostOwner } from '@core/domain/post/entity/PostOwner';
import { PostUseCaseDto } from '@core/domain/post/usecase/dto/PostUseCaseDto';
import { v4 } from 'uuid';

describe('PostUseCaseDto', () => {

  describe('newFromPost', () => {
  
    test('Expect it creates PostUseCaseDto instance with required parameters', async () => {
      const post: Post = await createPost();
      const postUseCaseDto: PostUseCaseDto = PostUseCaseDto.newFromPost(post);
      
      const expectedOwner: Record<string, unknown> = {
        id  : post.getOwner().getId(),
        name: post.getOwner().getName(),
        role: post.getOwner().getRole()
      };
  
      const expectedImage: Record<string, unknown> = {
        id : post.getImage()!.getId(),
        url: post.getImage()!.getRelativePath(),
      };
  
      expect(postUseCaseDto.id).toBe(post.getId());
      expect(postUseCaseDto.owner).toEqual(expectedOwner);
      expect(postUseCaseDto.image).toEqual(expectedImage);
      expect(postUseCaseDto.title).toBe(post.getTitle());
      expect(postUseCaseDto.content).toBe(post.getContent());
      expect(postUseCaseDto.status).toBe(post.getStatus());
      expect(postUseCaseDto.createdAt).toBe(post.getCreatedAt().getTime());
      expect(postUseCaseDto.publishedAt).toBe(post.getPublishedAt()?.getTime());
      expect(postUseCaseDto.editedAt).toBe(post.getEditedAt()?.getTime());
    });
    
  });
  
  describe('newListFromPosts', () => {
    
    test('Expect it creates PostUseCaseDto instances with required parameters', async () => {
      const post: Post = await createPost();
      const postUseCaseDtos: PostUseCaseDto[] = PostUseCaseDto.newListFromPosts([post]);
  
      const expectedOwner: Record<string, unknown> = {
        id  : post.getOwner().getId(),
        name: post.getOwner().getName(),
        role: post.getOwner().getRole()
      };
  
      const expectedImage: Record<string, unknown> = {
        id : post.getImage()!.getId(),
        url: post.getImage()!.getRelativePath(),
      };
  
      expect(postUseCaseDtos.length).toBe(1);
      expect(postUseCaseDtos[0].id).toBe(post.getId());
      expect(postUseCaseDtos[0].owner).toEqual(expectedOwner);
      expect(postUseCaseDtos[0].image).toEqual(expectedImage);
      expect(postUseCaseDtos[0].title).toBe(post.getTitle());
      expect(postUseCaseDtos[0].content).toBe(post.getContent());
      expect(postUseCaseDtos[0].status).toBe(post.getStatus());
      expect(postUseCaseDtos[0].createdAt).toBe(post.getCreatedAt().getTime());
      expect(postUseCaseDtos[0].publishedAt).toBe(post.getPublishedAt()?.getTime());
      expect(postUseCaseDtos[0].editedAt).toBe(post.getEditedAt()?.getTime());
    });
    
  });
  
});

async function createPost(): Promise<Post> {
  return Post.new({
    owner      : await PostOwner.new(v4(), v4(), UserRole.AUTHOR),
    title      : v4(),
    image      : await PostImage.new(v4(), '/relative/path'),
    content    : v4(),
    status     : PostStatus.PUBLISHED,
    editedAt   : new Date(),
    publishedAt: new Date(),
  });
}
