import { CreatePostUseCase } from '../../../domain/post/usecase/CreatePostUseCase';
import { PostRepositoryPort } from '../../../domain/post/port/persistence/PostRepositoryPort';
import { CreatePostPort } from '../../../domain/post/port/usecase/CreatePostPort';
import { PostUseCaseDto } from '../../../domain/post/usecase/dto/PostUseCaseDto';
import { Post } from '../../../domain/post/entity/Post';
import { QueryBusPort } from '../../../domain/.shared/port/cqers/QueryBusPort';
import { DoesMediaExistQueryResult } from '../../../domain/.shared/cqers/query/media/result/DoesMediaExistQueryResult';
import { DoesMediaExistQuery } from '../../../domain/.shared/cqers/query/media/DoesMediaExistQuery';
import { Exception } from '../../../domain/.shared/exception/Exception';
import { Code } from '../../../domain/.shared/code/Code';

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
    if (payload.imageId) {
      const doesImageExistQuery: DoesMediaExistQuery = DoesMediaExistQuery.new({id: payload.imageId})
      const doesImageExistQueryResult: DoesMediaExistQueryResult = await this.queryBus.sendQuery(doesImageExistQuery);
      
      if (!doesImageExistQueryResult.doesExist) {
        throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Post image not found.'})
      }
    }
  }
  
}
