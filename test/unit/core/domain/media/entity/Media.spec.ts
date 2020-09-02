import { MediaType } from '@core/common/enums/MediaEnums';
import { Media } from '@core/domain/media/entity/Media';
import { CreateMediaEntityPayload } from '@core/domain/media/entity/type/CreateMediaEntityPayload';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/CreateFileMetadataValueObjectPayload';
import { v4 } from 'uuid';

describe('Media', () => {
  
  describe('new', () => {
    
    test('When input optional args are empty, expect it creates Media instance with default parameters', async () => {
      const currentDate: number = Date.now();
      
      const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
        relativePath: '/relative/path'
      };
      
      const createMediaEntityPayload: CreateMediaEntityPayload = {
        ownerId : v4(),
        name    : 'Avatar',
        type    : MediaType.IMAGE,
        metadata: await FileMetadata.new(createFileMetadataValueObjectPayload),
      };
      
      const media: Media = await Media.new(createMediaEntityPayload);
      
      const expectedMetadata: Record<string, unknown> = {
        relativePath: createFileMetadataValueObjectPayload.relativePath,
        size        : null,
        ext         : null,
        mimetype    : null
      };
  
      expect(typeof media.getId() === 'string').toBeTruthy();
      expect(media.getOwnerId()).toBe(createMediaEntityPayload.ownerId);
      expect(media.getName()).toBe(createMediaEntityPayload.name);
      expect(media.getType()).toBe(createMediaEntityPayload.type);
      expect(media.getMetadata()).toBeInstanceOf(FileMetadata);
      expect(media.getMetadata()).toEqual(expectedMetadata);
      expect(media.getCreatedAt().getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
      expect(media.getEditedAt()).toBeNull();
      expect(media.getRemovedAt()).toBeNull();
    });
  
    test('When input optional args are set, expect it creates Media instance with custom parameters', async () => {
      const customId: string = v4();
      const customCreatedAt: Date = new Date(Date.now() - 3000);
      const customEditedAt: Date = new Date(Date.now() - 2000);
      const customRemovedAt: Date = new Date(Date.now() - 1000);
    
      const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
        relativePath: '/relative/path',
        size        : 10_000_000,
        ext         : 'png',
        mimetype    : 'image/png'
      };
    
      const createMediaEntityPayload: CreateMediaEntityPayload = {
        ownerId  : v4(),
        name     : 'Avatar',
        type     : MediaType.IMAGE,
        metadata : await FileMetadata.new(createFileMetadataValueObjectPayload),
        id       : customId,
        createdAt: customCreatedAt,
        editedAt : customEditedAt,
        removedAt: customRemovedAt
      };
    
      const media: Media = await Media.new(createMediaEntityPayload);
    
      const expectedMetadata: Record<string, unknown> = {
        relativePath: createFileMetadataValueObjectPayload.relativePath,
        size        : createFileMetadataValueObjectPayload.size,
        ext         : createFileMetadataValueObjectPayload.ext,
        mimetype    : createFileMetadataValueObjectPayload.mimetype
      };
    
      expect(media.getId()).toBe(customId);
      expect(media.getOwnerId()).toBe(createMediaEntityPayload.ownerId);
      expect(media.getName()).toBe(createMediaEntityPayload.name);
      expect(media.getType()).toBe(createMediaEntityPayload.type);
      expect(media.getMetadata()).toBeInstanceOf(FileMetadata);
      expect(media.getMetadata()).toEqual(expectedMetadata);
      expect(media.getCreatedAt()).toBe(customCreatedAt);
      expect(media.getEditedAt()).toBe(customEditedAt);
      expect(media.getRemovedAt()).toBe(customRemovedAt);
    });
    
  });
  
  describe('edit', () => {
    
    test('When input args are empty, expect it doesn\'t edit Media instance', async () => {
      const media: Media = await Media.new({
        ownerId : v4(),
        name    : 'Avatar',
        type    : MediaType.IMAGE,
        metadata: await FileMetadata.new({relativePath: '/relative/path'}),
      });
  
      await media.edit({});
  
      const expectedMetadata: Record<string, unknown> = {
        relativePath: '/relative/path',
        size        : null,
        ext         : null,
        mimetype    : null
      };
      
      expect(media.getName()).toBe('Avatar');
      expect(media.getMetadata()).toEqual(expectedMetadata);
      expect(media.getEditedAt()).toBeNull();
    });
  
    test('When input args are set, expect it edits Media instance', async () => {
      const currentDate: number = Date.now();
    
      const media: Media = await Media.new({
        ownerId : v4(),
        name    : 'My Avatar',
        type    : MediaType.IMAGE,
        metadata: await FileMetadata.new({relativePath: '/relative/path'}),
      });
    
      await media.edit({name: 'New My Avatar', metadata: await FileMetadata.new({relativePath: '/new/relative/path'})});
  
      const expectedMetadata: Record<string, unknown> = {
        relativePath: '/new/relative/path',
        size        : null,
        ext         : null,
        mimetype    : null
      };
    
      expect(media.getName()).toBe('New My Avatar');
      expect(media.getMetadata()).toEqual(expectedMetadata);
      expect(media.getEditedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
  describe('remove', () => {
    
    test('Expect it marks Media instance as removed', async () => {
      const currentDate: number = Date.now();
      
      const media: Media = await Media.new({
        ownerId : v4(),
        name    : v4(),
        type    : MediaType.IMAGE,
        metadata: await FileMetadata.new({relativePath: '/relative/path'}),
      });
      
      await media.remove();
      
      expect(media.getRemovedAt()!.getTime()).toBeGreaterThanOrEqual(currentDate - 5000);
    });
    
  });
  
});
