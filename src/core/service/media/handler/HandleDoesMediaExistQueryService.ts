import { DoesMediaExistQuery } from '@core/common/message/query/queries/media/DoesMediaExistQuery';
import { DoesMediaExistQueryResult } from '@core/common/message/query/queries/media/result/DoesMediaExistQueryResult';
import { DoesMediaExistQueryHandler } from '@core/domain/media/handler/DoesMediaExistQueryHandler';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';

export class HandleDoesMediaExistQueryService implements DoesMediaExistQueryHandler {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  public async handle(query: DoesMediaExistQuery): Promise<DoesMediaExistQueryResult> {
    const count: number = await this.mediaRepository.countMedias(query.by);
    return DoesMediaExistQueryResult.new(!!count);
  }
  
}
