import { MediaType } from '@core/common/enums/MediaEnums';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaListPort } from '@core/domain/media/port/usecase/GetMediaListPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaListUseCase } from '@core/domain/media/usecase/GetMediaListUseCase';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { GetMediaListService } from '@core/service/media/usecase/GetMediaListService';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('GetMediaListService', () => {
  let getMediaListService: GetMediaListUseCase;
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.GetMediaListUseCase,
          useFactory: (mediaRepository) => new GetMediaListService(mediaRepository),
          inject: [MediaDITokens.MediaRepository]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        }
      ]
    }).compile();
  
    getMediaListService = module.get<GetMediaListUseCase>(MediaDITokens.GetMediaListUseCase);
    mediaRepository = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it returns media list', async () => {
      const mockMedia: Media = await createMedia();
      
      jest.spyOn(mediaRepository, 'findMedias').mockImplementation(async () => [mockMedia]);
      
      const expectedMediaUseCaseDto: MediaUseCaseDto = await MediaUseCaseDto.newFromMedia(mockMedia);
  
      const getMediaListPort: GetMediaListPort = {executorId: mockMedia.getOwnerId()};
      const resultMediaUseCaseDtos: MediaUseCaseDto[] = await getMediaListService.execute(getMediaListPort);
  
      expect(resultMediaUseCaseDtos.length).toBe(1);
      expect(resultMediaUseCaseDtos[0]).toEqual(expectedMediaUseCaseDto);
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
