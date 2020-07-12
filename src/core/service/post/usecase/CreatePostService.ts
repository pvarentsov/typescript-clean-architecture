import { CreatePostUseCase } from '../../../domain/post/usecase/CreatePostUseCase';
import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { CreatePostPort } from '../../../domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { QueryBusPort } from '../../../domain/.shared/port/cqers/QueryBusPort';
import { ExternalPostRelationsValidator, PostValidationRelations } from './shared/ExternalRelationsValidator';

export class CreatePostService implements CreatePostUseCase {
  
  constructor(
    private readonly postRepository: PostRepositoryPort,
    private readonly queryBus: QueryBusPort,
  ) {}
  
  public async execute(payload: CreatePostPort): Promise<PostUseCaseDto> {
    await this.validateExternalRelations(payload);
    
    const post: Post = await Post.new({
      authorId: payload.executorId,
      title: payload.title,
      imageId: payload.imageId,
      content: payload.content,
    });
    
    await this.postRepository.addPost(post);
    
    return PostUseCaseDto.newFromPost(post);
  }
  
  private async validateExternalRelations(payload: CreatePostPort): Promise<void> {
    const relations: PostValidationRelations = {};
    
    if (payload.imageId) {
      relations.image = {id: payload.imageId, userId: payload.executorId};
    }
    
    await ExternalPostRelationsValidator.validate(relations, this.queryBus);
  }
  
}
