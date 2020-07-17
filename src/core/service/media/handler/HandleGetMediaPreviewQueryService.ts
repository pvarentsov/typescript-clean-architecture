import { MediaRepositoryPort } from '../../../domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaPreviewQueryHandler } from '../../../domain/media/handler/GetMediaPreviewQueryHandler';
import { GetMediaPreviewQuery } from '../../../common/cqers/query/queries/media/GetMediaPreviewQuery';
import { Optional } from '../../../common/type/CommonTypes';
import { Media } from '../../../domain/media/entity/Media';
import { GetMediaPreviewQueryResult } from '../../../common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';

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
