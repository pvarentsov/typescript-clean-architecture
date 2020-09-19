import { MediaRemovedEvent } from '@core/common/message/event/events/media/MediaRemovedEvent';
import { MediaType } from '@core/common/enums/MediaEnums';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { PostImageRemovedEventHandler } from '@core/domain/post/handler/PostImageRemovedEventHandler';
import { PostRepositoryPort } from '@core/domain/post/port/persistence/PostRepositoryPort';
import { HandlePostImageRemovedEventService } from '@core/service/post/handler/HandlePostImageRemovedEventService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

describe('HandlePostImageRemovedEventService', () => {
  let postImageRemovedEventHandler: PostImageRemovedEventHandler;
  let postRepository: PostRepositoryPort;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PostDITokens.PostImageRemovedEventHandler,
          useFactory: (postRepository) => new HandlePostImageRemovedEventService(postRepository),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useClass: TypeOrmPostRepositoryAdapter
        },
      ]
    }).compile();
    
    postImageRemovedEventHandler = module.get<PostImageRemovedEventHandler>(PostDITokens.PostImageRemovedEventHandler);
    postRepository               = module.get<PostRepositoryPort>(PostDITokens.PostRepository);
  });
  
  describe('execute', () => {
  
    test('When image media is removed, expect it sets "imageId = null" for all dependent posts', async () => {
      const mediaRemovedEvent: MediaRemovedEvent = MediaRemovedEvent.new(v4(), v4(), MediaType.IMAGE);
    
      jest.spyOn(postRepository, 'updatePosts').mockImplementation(async () => undefined);
      jest.spyOn(postRepository, 'updatePosts').mockClear();
  
      await postImageRemovedEventHandler.handle(mediaRemovedEvent);
  
      const attributes: Record<string, unknown> = jest.spyOn(postRepository, 'updatePosts').mock.calls[0][0];
      const filter: Record<string, unknown> = jest.spyOn(postRepository, 'updatePosts').mock.calls[0][1];
      
      expect(attributes).toEqual({imageId: null});
      expect(filter).toEqual({imageId: mediaRemovedEvent.mediaId});
    });
  
    test('When not image media is removed, expect it does not nothing', async () => {
      const mediaUnknownType: unknown = 'UNKNOWN_TYPE';
      const mediaRemovedEvent: MediaRemovedEvent = MediaRemovedEvent.new(v4(), v4(), mediaUnknownType as MediaType);
    
      jest.spyOn(postRepository, 'updatePosts').mockImplementation(async () => undefined);
      jest.spyOn(postRepository, 'updatePosts').mockClear();
    
      await postImageRemovedEventHandler.handle(mediaRemovedEvent);
      
      expect(jest.spyOn(postRepository, 'updatePosts').mock.calls.length).toBe(0);
    });
  
  });
  
});
