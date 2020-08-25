import { Test, TestingModule } from '@nestjs/testing';
import { RemoveMediaUseCase } from '../../../../../../src/core/domain/media/usecase/RemoveMediaUseCase';
import { MediaRepositoryPort } from '../../../../../../src/core/domain/media/port/persistence/MediaRepositoryPort';
import { MediaDITokens } from '../../../../../../src/core/domain/media/di/MediaDITokens';
import { RemoveMediaService } from '../../../../../../src/core/service/media/usecase/RemoveMediaService';
import { TypeOrmMediaRepositoryAdapter } from '../../../../../../src/infrastructure/adapter/persistence/typeorm/repository/media/TypeOrmMediaRepositoryAdapter';
import { FileMetadata } from '../../../../../../src/core/domain/media/value-object/FileMetadata';
import { Media } from '../../../../../../src/core/domain/media/entity/Media';
import { v4 } from 'uuid';
import { MediaType } from '../../../../../../src/core/common/enums/MediaEnums';
import { RemoveMediaPort } from '../../../../../../src/core/domain/media/port/usecase/RemoveMediaPort';
import { Exception } from '../../../../../../src/core/common/exception/Exception';
import { ClassValidationDetails } from '../../../../../../src/core/common/util/class-validator/ClassValidator';
import { Code } from '../../../../../../src/core/common/code/Code';
import { EventBusPort } from '../../../../../../src/core/common/port/cqers/EventBusPort';
import { CoreDITokens } from '../../../../../../src/core/common/di/CoreDITokens';
import { NestEventBusAdapter } from '../../../../../../src/infrastructure/adapter/cqers/NestEventBusAdapter';
import { MediaRemovedEvent } from '../../../../../../src/core/common/cqers/event/events/media/MediaRemovedEvent';
import { CqrsModule } from '@nestjs/cqrs';

describe('RemoveMediaService', () => {
  let removeMediaService: RemoveMediaUseCase;
  let mediaRepository: MediaRepositoryPort;
  let eventBus: EventBusPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        {
          provide: MediaDITokens.RemoveMediaUseCase,
          useFactory: (mediaRepository, eventBus) => new RemoveMediaService(mediaRepository, eventBus),
          inject: [MediaDITokens.MediaRepository, CoreDITokens.EventBus]
        },
        {
          provide: MediaDITokens.MediaRepository,
          useClass: TypeOrmMediaRepositoryAdapter
        },
        {
          provide: CoreDITokens.EventBus,
          useClass: NestEventBusAdapter
        }
      ]
    }).compile();
  
    removeMediaService = module.get<RemoveMediaUseCase>(MediaDITokens.RemoveMediaUseCase);
    mediaRepository    = module.get<MediaRepositoryPort>(MediaDITokens.MediaRepository);
    eventBus           = module.get<EventBusPort>(CoreDITokens.EventBus);
  });
  
  describe('execute', () => {
  
    test('Expect it removes media and sends event about it', async () => {
      const mockMedia: Media = await createMedia();
      
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
      jest.spyOn(mediaRepository, 'removeMedia').mockImplementation(async () => undefined);
      jest.spyOn(eventBus, 'sendEvent').mockImplementation(async () => undefined);
      
      jest.spyOn(mediaRepository, 'removeMedia').mockClear();
      jest.spyOn(eventBus, 'sendEvent').mockClear();
  
      const removeMediaPort: RemoveMediaPort = {
        executorId: mockMedia.getOwnerId(),
        mediaId   : mockMedia.getId(),
      };
      
      await removeMediaService.execute(removeMediaPort);
      
      const removedMedia: Media = jest.spyOn(mediaRepository, 'removeMedia').mock.calls[0][0];
      const mediaRemovedEvent: MediaRemovedEvent = jest.spyOn(eventBus, 'sendEvent').mock.calls[0][0] as MediaRemovedEvent;
      
      expect(removedMedia).toEqual(mockMedia);
      expect(mediaRemovedEvent).toEqual(MediaRemovedEvent.new(mockMedia.getId(), mockMedia.getOwnerId(), mockMedia.getType()));
      
    });
  
    test('When media not found, expect it throws Exception', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => undefined);
      
      expect.hasAssertions();
      
      try {
        const removeMediaPort: RemoveMediaPort = {executorId: v4(), mediaId: v4()};
        await removeMediaService.execute(removeMediaPort);
        
      } catch (e) {
  
        const exception: Exception<ClassValidationDetails> = e;
  
        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  
    test('When user try to remove other people\'s media, expect it throws Exception', async () => {
      const mockMedia: Media = await createMedia();
      const executorId: string = v4();
    
      jest.spyOn(mediaRepository, 'findMedia').mockImplementation(async () => mockMedia);
    
      expect.hasAssertions();
    
      try {
        const removeMediaPort: RemoveMediaPort = {executorId: executorId, mediaId: mockMedia.getId()};
        await removeMediaService.execute(removeMediaPort);
      
      } catch (e) {
      
        const exception: Exception<ClassValidationDetails> = e;
      
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
    removedAt: new Date()
  });
}
