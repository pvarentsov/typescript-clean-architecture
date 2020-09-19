import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { GetMediaPreviewQueryResult } from '@core/common/message/query/queries/media/result/GetMediaPreviewQueryResult';
import { MediaType } from '@core/common/enums/MediaEnums';
import { Optional } from '@core/common/type/CommonTypes';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { GetMediaPreviewQueryHandler } from '@core/domain/media/handler/GetMediaPreviewQueryHandler';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { HandleGetMediaPreviewQueryService } from '@core/service/media/handler/HandleGetMediaPreviewQueryService';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('HandleGetMediaPreviewQueryService', () => {
  let getMediaPreviewQueryHandler: GetMediaPreviewQueryHandler;
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.GetMediaPreviewQueryHandler,
          useFactory: (mediaRepository) => new HandleGetMediaPreviewQueryService(mediaRepository),
          inject: [MediaDITokens.MediaRepository]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        }
      ]
    }).compile();
  
    getMediaPreviewQueryHandler = module.get<GetMediaPreviewQueryHandler>(MediaDITokens.GetMediaPreviewQueryHandler);
    mediaRepository             = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
  });
  
  describe('handle', () => {
  
    test('When media found, expect it returns media preview', async () => {
      const mockMedia: Media = await createMedia();
      
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
      
      const expectedPreview: GetMediaPreviewQueryResult = GetMediaPreviewQueryResult.new(
        mockMedia.getId(),
        mockMedia.getType(),
        mockMedia.getMetadata().relativePath
      );
  
      const getMediaPreviewQuery: GetMediaPreviewQuery = {by: {}};
      const resultPreview: Optional<GetMediaPreviewQueryResult> = await getMediaPreviewQueryHandler.handle(getMediaPreviewQuery);
      
      expect(resultPreview).toEqual(expectedPreview);
    });
  
    test('When media not found, expect it returns nothing', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => undefined);
      
      const getMediaPreviewQuery: GetMediaPreviewQuery = {by: {}};
      const resultPreview: Optional<GetMediaPreviewQueryResult> = await getMediaPreviewQueryHandler.handle(getMediaPreviewQuery);
    
      expect(resultPreview).toBeUndefined();
    });
    
  });
  
});

async function createMedia(): Promise<Media> {
  const metadata: FileMetadata = await FileMetadata.new({
    relativePath: '/relative/path',
    size        : 10_000_000,
    ext         : 'png',
    mimetype    : 'image/png'
  });
  
  return Media.new({
    ownerId : v4(),
    name    : v4(),
    type    : MediaType.IMAGE,
    metadata: metadata,
  });
}
