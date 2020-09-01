import { Entity } from '@core/common/entity/Entity';
import { IsString } from 'class-validator';

export class PostImage extends Entity<string> {
  
  @IsString()
  private readonly relativePath: string;
  
  constructor(id: string, relativePath: string) {
    super();
    
    this.id = id;
    this.relativePath = relativePath;
  }
  
  public getRelativePath(): string {
    return this.relativePath;
  }
  
  public static async new(id: string, relativePath: string): Promise<PostImage> {
    const postImage: PostImage = new PostImage(id, relativePath);
    await postImage.validate();
    
    return postImage;
  }
  
}
