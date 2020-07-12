import { PostRepositoryPort } from '../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../domain/post/entity/Post';
import { EditPostUseCase } from '../../domain/post/usecase/EditPostUseCase';
import { EditPostPort } from '../../domain/post/port/usecase/EditPostPort';
import { Optional } from '../../domain/.shared/type/CommonTypes';
import { Exception } from '../../domain/.shared/exception/Exception';
import { Code } from '../../domain/.shared/code/Code';
import { DoesMediaExistQuery } from '../../domain/.shared/cqers/query/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '../../domain/.shared/cqers/query/media/result/DoesMediaExistQueryResult';
import { QueryBusPort } from '../../domain/.shared/port/cqers/QueryBusPort';

export class EditPostService implements EditPostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: EditPostPort): Promise<PostUseCaseDto> {
    const post: Optional<Post> = await this.postRepository.findPost({id: payload.postId});
    if (!post) {
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post not found.'})
    }
    
    await this.validateExternalRelations(payload);
    
    await post.edit({
      title: payload.title,
      imageId: payload.imageId,
      content: payload.content
    });
    
    await this.postRepository.updatePost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
  private async validateExternalRelations(payload: EditPostPort): Promise<void> {
    if (payload.imageId) {
      const doesImageExistQuery: DoesMediaExistQuery = DoesMediaExistQuery.new(payload.imageId)
      const doesImageExistQueryResult: DoesMediaExistQueryResult = await this.queryBus.sendQuery(doesImageExistQuery);
      
      if (!doesImageExistQueryResult.doesExist) {
        throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'})
      }
    }
  }
  
}
