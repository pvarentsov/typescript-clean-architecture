import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepositoryPort } from '../../../../../src/core/domain/media/port/persistence/MediaRepositoryPort';
import { MediaDITokens } from '../../../../../src/core/domain/media/di/MediaDITokens';
import { TypeOrmMediaRepositoryAdapter } from '../../../../../src/infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { FileMetadata } from '../../../../../src/core/domain/media/value-object/FileMetadata';
import { Media } from '../../../../../src/core/domain/media/entity/Media';
import { v4 } from 'uuid';
import { MediaType } from '../../../../../src/core/common/enums/MediaEnums';
import { HandleGetMediaPreviewQueryService } from '../../../../../src/core/service/media/handler/HandleGetMediaPreviewQueryService';
import { GetMediaPreviewQueryHandler } from '../../../../../src/core/domain/media/handler/GetMediaPreviewQueryHandler';
import { GetMediaPreviewQueryResult } from '../../../../../src/core/common/cqers/query/queries/media/result/GetMediaPreviewQueryResult';
import { GetMediaPreviewQuery } from '../../../../../src/core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { Optional } from '../../../../../src/core/common/type/CommonTypes';

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
