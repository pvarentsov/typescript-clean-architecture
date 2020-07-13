import { DoesMediaExistQueryHandler } from '../../../domain/media/handler/DoesMediaExistQueryHandler';
import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { DoesMediaExistQuery } from '../../../shared/cqers/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '../../../shared/cqers/query/queries/media/result/DoesMediaExistQueryResult';

export class HandleDoesMediaExistQueryService implements DoesMediaExistQueryHandler {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  public async handle(query: DoesMediaExistQuery): Promise<DoesMediaExistQueryResult> {
    const count: number = await this.mediaRepository.countMedia(query.by);
    return DoesMediaExistQueryResult.new(!!count);
  }
  
}
