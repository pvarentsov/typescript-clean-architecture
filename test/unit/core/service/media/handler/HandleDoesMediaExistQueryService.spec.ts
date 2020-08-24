import { Test, TestingModule } from '@nestjs/testing';
import { MediaRepositoryPort } from '../../../../../../src/core/domain/media/port/persistence/MediaRepositoryPort';
import { MediaDITokens } from '../../../../../../src/core/domain/media/di/MediaDITokens';
import { TypeOrmMediaRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { HandleDoesMediaExistQueryService } from '../../../../../../src/core/service/media/handler/HandleDoesMediaExistQueryService';
import { GetMediaPreviewQuery } from '../../../../../../src/core/common/cqers/query/queries/media/GetMediaPreviewQuery';
import { DoesMediaExistQueryHandler } from '../../../../../../src/core/domain/media/handler/DoesMediaExistQueryHandler';
import { DoesMediaExistQueryResult } from '../../../../../../src/core/common/cqers/query/queries/media/result/DoesMediaExistQueryResult';

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
