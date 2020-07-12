import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { EditPostUseCase } from '../../../domain/post/usecase/EditPostUseCase';
import { EditPostPort } from '../../../domain/post/port/usecase/EditPostPort';
import { Optional } from '../../../domain/.shared/type/CommonTypes';
import { Exception } from '../../../domain/.shared/exception/Exception';
import { Code } from '../../../domain/.shared/code/Code';
import { QueryBusPort } from '../../../domain/.shared/port/cqers/QueryBusPort';
import { ExternalPostRelationsValidator, PostValidationRelations } from './shared/ExternalPostRelationsValidator';

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
    const relations: PostValidationRelations = {};
    
    if (payload.imageId) {
      relations.image = {id: payload.imageId, userId: payload.executorId};
    }
    
    await ExternalPostRelationsValidator.validate(relations, this.queryBus);
  }
  
}
