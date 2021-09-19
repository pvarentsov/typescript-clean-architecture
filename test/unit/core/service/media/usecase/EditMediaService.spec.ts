import { Code } from '@core/common/code/Code';
import { MediaType } from '@core/common/enums/MediaEnums';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/ClassValidator';
import { MediaDITokens } from '@core/domain/media/di/MediaDITokens';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { EditMediaPort } from '@core/domain/media/port/usecase/EditMediaPort';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { EditMediaUseCase } from '@core/domain/media/usecase/EditMediaUseCase';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { EditMediaService } from '@core/service/media/usecase/EditMediaService';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('EditMediaService', () => {
  let editMediaService: EditMediaUseCase;
  let mediaRepository: MediaRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.EditMediaUseCase,
          useFactory: (mediaRepository) => new EditMediaService(mediaRepository),
          inject: [MediaDITokens.MediaRepository]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        }
      ]
    }).compile();
  
    editMediaService = module.get<EditMediaUseCase>(MediaDITokens.EditMediaUseCase);
    mediaRepository  = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
  });
  
  describe('execute', () => {
  
    test('Expect it edits media and updates media record in repository', async () => {
      const mockMedia: Media = await createMedia();
      
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
      jest.spyOn(mediaRepository, 'updateMedia').mockImplementation(async () => undefined);
      
      jest.spyOn(mediaRepository, 'updateMedia').mockClear();
  
      const editMediaPort: EditMediaPort = {
        executorId: mockMedia.getOwnerId(),
        mediaId   : mockMedia.getId(),
        name      : 'New Name',
      };
      
      const expectedMedia: Media = await Media.new({
        id       : mockMedia.getId(),
        ownerId  : mockMedia.getOwnerId(),
        name     : 'New Name',
        type     : mockMedia.getType(),
        metadata : mockMedia.getMetadata(),
        createdAt: mockMedia.getCreatedAt(),
      });
  
      const expectedMediaUseCaseDto: MediaUseCaseDto = await MediaUseCaseDto.newFromMedia(expectedMedia);
      
      const resultMediaUseCaseDto: MediaUseCaseDto = await editMediaService.execute(editMediaPort);
      const resultUpdatedMedia: Media = jest.spyOn(mediaRepository, 'updateMedia').mock.calls[0][0];
  
      expect(resultMediaUseCaseDto.editedAt).toBeGreaterThanOrEqual(mockMedia.getEditedAt()!.getTime());
      
      expect(resultMediaUseCaseDto).toEqual({...expectedMediaUseCaseDto, editedAt: resultMediaUseCaseDto.editedAt});
      expect(resultUpdatedMedia).toEqual({...expectedMedia, editedAt: resultUpdatedMedia.getEditedAt()});
    });
  
    test('When media not found, expect it throws Exception', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const editMediaPort: EditMediaPort = {executorId: v4(), mediaId: v4(), name: v4()};
        await editMediaService.execute(editMediaPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to update other people\'s media, expect it throws Exception', async () => {
      const mockMedia: Media = await createMedia();
      const executorId: string = v4();
    
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
    
      expect.hasAssertions();
    
      try {
        const editMediaPort: EditMediaPort = {executorId: executorId, mediaId: mockMedia.getId(), name: v4()};
        await editMediaService.execute(editMediaPort);
      
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
    editedAt: new Date()
  });
}
