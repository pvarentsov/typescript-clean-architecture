import { GetMediaPreviewQuery } from '@core/common/message/query/queries/media/GetMediaPreviewQuery';
import { DoesMediaExistQueryResult } from '@core/common/message/query/queries/media/result/DoesMediaExistQueryResult';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { DoesMediaExistQueryHandler } from '@core/domain/media/handler/DoesMediaExistQueryHandler';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { HandleDoesMediaExistQueryService } from '@core/service/media/handler/HandleDoesMediaExistQueryService';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';

describe('HandleDoesMediaExistQueryService', () => {
  let doesMediaExistQueryHandler: DoesMediaExistQueryHandler;
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.DoesMediaExistQueryHandler,
          useFactory: (mediaRepository) => new HandleDoesMediaExistQueryService(mediaRepository),
          inject: [MediaDITokens.MediaRepository]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        }
      ]
    }).compile();
  
    doesMediaExistQueryHandler = module.get<DoesMediaExistQueryHandler>(MediaDITokens.DoesMediaExistQueryHandler);
    mediaRepository            = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
  });
  
  describe('handle', () => {
  
    test('When found media count is greater than 0, expect it returns positive result', async () => {
      jest.spyOn(mediaRepository, 'countMedias').mockImplementation(async () => 1);
      
      const expectedResult: DoesMediaExistQueryResult = DoesMediaExistQueryResult.new(true);
  
      const getMediaPreviewQuery: GetMediaPreviewQuery = {by: {}};
      const result: DoesMediaExistQueryResult = await doesMediaExistQueryHandler.handle(getMediaPreviewQuery);
      
      expect(result).toEqual(expectedResult);
    });
  
    test('When found media count is 0, expect it returns negative result', async () => {
      jest.spyOn(mediaRepository, 'countMedias').mockImplementation(async () => 0);
    
      const expectedResult: DoesMediaExistQueryResult = DoesMediaExistQueryResult.new(false);
    
      const getMediaPreviewQuery: GetMediaPreviewQuery = {by: {}};
      const result: DoesMediaExistQueryResult = await doesMediaExistQueryHandler.handle(getMediaPreviewQuery);
    
      expect(result).toEqual(expectedResult);
    });
    
  });
  
});
