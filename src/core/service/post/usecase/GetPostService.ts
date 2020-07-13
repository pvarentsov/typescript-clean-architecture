import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { Optional } from '../../../common/type/CommonTypes';
import { Exception } from '../../../common/exception/Exception';
import { Code } from '../../../common/code/Code';
import { GetPostUseCase } from '../../../domain/post/usecase/GetPostUseCase';
import { GetPostPort } from '../../../domain/post/port/usecase/GetPostPort';

export class GetPostService implements GetPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
  ) {}
  
  public async execute(payload: GetPostPort): Promise<PostUseCaseDto> {
    const post: Optional<Post> = await this.postRepository.findPost({id: payload.postId});
    if (!post) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'});
    }
    
    return PostUseCaseDto.newFromPost(post);
  }
  
}
