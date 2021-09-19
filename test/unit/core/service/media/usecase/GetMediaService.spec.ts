import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { GetMediaPort } from '@core/domain/media/port/usecase/GetMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { GetMediaUseCase } from '@core/domain/media/usecase/GetMediaUseCase';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { GetMediaService } from '@core/service/media/usecase/GetMediaService';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('GetMediaService', () => {
  let getMediaService: GetMediaUseCase;
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.GetMediaUseCase,
          useFactory: (mediaRepository) => new GetMediaService(mediaRepository),
          inject: [MediaDITokens.MediaRepository]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        }
      ]
    }).compile();
  
    getMediaService = module.get<GetMediaUseCase>(MediaDITokens.GetMediaUseCase);
    mediaRepository = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it returns media', async () => {
      const mockMedia: Media = await createMedia();
      
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
      
      const expectedMediaUseCaseDto: MediaUseCaseDto = await MediaUseCaseDto.newFromMedia(mockMedia);
  
      const getMediaPort: GetMediaPort = {executorId: mockMedia.getOwnerId(), mediaId: mockMedia.getId()};
      const resultMediaUseCaseDto: MediaUseCaseDto = await getMediaService.execute(getMediaPort);
      
      expect(resultMediaUseCaseDto).toEqual(expectedMediaUseCaseDto);

    });
  
    test('When media not found, expect it throws Exception', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const getMediaPort: GetMediaPort = {executorId: v4(), mediaId: v4()};
        await getMediaService.execute(getMediaPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to get other people\'s media, expect it throws Exception', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
    
      expect.hasAssertions();
    
      try {
        const getMediaPort: GetMediaPort = {executorId: v4(), mediaId: v4()};
        await getMediaService.execute(getMediaPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
      
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
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
