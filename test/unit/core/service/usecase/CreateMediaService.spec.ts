import { Test, TestingModule } from '@nestjs/testing';
import { CreateMediaUseCase } from '../../../../../src/core/domain/media/usecase/CreateMediaUseCase';
import { MediaRepositoryPort } from '../../../../../src/core/domain/media/port/persistence/MediaRepositoryPort';
import { MediaFileStoragePort } from '../../../../../src/core/domain/media/port/persistence/MediaFileStoragePort';
import { MediaDITokens } from '../../../../../src/core/domain/media/di/MediaDITokens';
import { CreateMediaService } from '../../../../../src/core/service/media/usecase/CreateMediaService';
import { TypeOrmMediaRepositoryAdapter } from '../../../../../src/infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { MinioMediaFileStorageAdapter } from '../../../../../src/infrastructure/adapter/persistence/media-file/MinioMediaFileStorageAdapter';
import { FileMetadata } from '../../../../../src/core/domain/media/value-object/FileMetadata';
import { CreateFileMetadataValueObjectPayload } from '../../../../../src/core/domain/media/value-object/type/CreateFileMetadataValueObjectPayload';
import { Media } from '../../../../../src/core/domain/media/entity/Media';
import { v4 } from 'uuid';
import { MediaType } from '../../../../../src/core/common/enums/MediaEnums';
import { CreateMediaPort } from '../../../../../src/core/domain/media/port/usecase/CreateMediaPort';
import { MediaUseCaseDto } from '../../../../../src/core/domain/media/usecase/dto/MediaUseCaseDto';

describe('CreateMediaService', () => {
  let createMediaService: CreateMediaUseCase;
  let mediaRepository: MediaRepositoryPort;
  let mediaFileStorage: MediaFileStoragePort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MediaDITokens.CreateMediaUseCase,
          useFactory: (mediaRepository, mediaFileStorage) => new CreateMediaService(mediaRepository, mediaFileStorage),
          inject: [MediaDITokens.MediaRepository, MediaDITokens.MediaFileStorage]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        },
        {
          provide: MediaDITokens.MediaFileStorage,
          useClass: MinioMediaFileStorageAdapter
        }
      ]
    }).compile();
  
    createMediaService = module.get<CreateMediaUseCase>(MediaDITokens.CreateMediaUseCase);
    mediaRepository    = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
    mediaFileStorage   = module.get<MediaFileStoragePort>(MediaDITokens.MediaFileStorage);
  });
  
  describe('execute', () => {
  
    test('Expect it uploads media file and adds media record to repository', async () => {
      const mockFileMetadata: FileMetadata = await createFileMetadata();
      const mockMediaId: string = v4();
      
      jest.spyOn(mediaFileStorage, 'upload').mockImplementation(async () => mockFileMetadata);
      jest.spyOn(mediaRepository, 'addMedia').mockImplementation(async () => {
        return {id: mockMediaId};
      });
  
      jest.spyOn(mediaRepository, 'addMedia').mockClear();
  
      const createMediaPort: CreateMediaPort = {
        executorId: v4(),
        name      : v4(),
        type      : MediaType.IMAGE,
        file      : Buffer.from(''),
      };
      
      const expectedMedia: Media = await Media.new({
        id      : mockMediaId,
        ownerId : createMediaPort.executorId,
        name    : createMediaPort.name,
        type    : createMediaPort.type,
        metadata: mockFileMetadata,
      });
  
      const expectedMediaUseCaseDto: MediaUseCaseDto = await MediaUseCaseDto.newFromMedia(expectedMedia);
      
      const resultMediaUseCaseDto: MediaUseCaseDto = await createMediaService.execute(createMediaPort);
      Reflect.set(resultMediaUseCaseDto, 'id', expectedMediaUseCaseDto.id);
      Reflect.set(resultMediaUseCaseDto, 'createdAt', expectedMediaUseCaseDto.createdAt);
      
      const resultAddedMedia: Media = jest.spyOn(mediaRepository, 'addMedia').mock.calls[0][0];
      Reflect.set(resultAddedMedia, 'id', expectedMedia.getId());
      Reflect.set(resultAddedMedia, 'createdAt', expectedMedia.getCreatedAt());
      
      expect(resultMediaUseCaseDto).toEqual(expectedMediaUseCaseDto);
      expect(resultAddedMedia).toEqual(expectedMedia);
    });
    
  });
  
});

async function createFileMetadata(): Promise<FileMetadata> {
  const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
    relativePath: '/relative/path',
    size        : 10_000_000,
    ext         : 'png',
    mimetype    : 'image/png'
  };
  
  return FileMetadata.new(createFileMetadataValueObjectPayload);
}
