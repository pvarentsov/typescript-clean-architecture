import { GetMediaPreviewQueryHandler } from '@core/domain/media/handler/GetMediaPreviewQueryHandler';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaPreviewQuery } from '@core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { Optional } from '@core/common/type/CommonTypes';
import { GetMediaPreviewQueryResult } from '@core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { Media } from '@core/domain/media/entity/Media';

export class HandleGetMediaPreviewQueryService implements GetMediaPreviewQueryHandler {
  
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
  ) {}

  public async handle(query: GetMediaPreviewQuery): Promise<Optional<GetMediaPreviewQueryResult>> {
    let queryResult: Optional<GetMediaPreviewQueryResult>;
    
    const media: Optional<Media> = await this.mediaRepository.findMedia(query.by);
    if (media) {
      queryResult = GetMediaPreviewQueryResult.new(media.getId(), media.getType(), media.getMetadata().relativePath);
    }
    
    return queryResult;
  }
  
}
