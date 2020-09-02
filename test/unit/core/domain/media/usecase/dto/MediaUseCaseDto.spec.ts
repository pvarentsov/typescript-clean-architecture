import { MediaType } from '@core/common/enums/MediaEnums';
import { Media } from '@core/domain/media/entity/Media';
import { CreateMediaEntityPayload } from '@core/domain/media/entity/type/CreateMediaEntityPayload';
import { MediaUseCaseDto } from '@core/domain/media/usecase/dto/MediaUseCaseDto';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { v4 } from 'uuid';

describe('MediaUseCaseDto', () => {

  describe('newFromMedia', () => {
  
    test('Expect it creates MediaUseCaseDto instance with required parameters', async () => {
      const media: Media = await createMedia();
      const mediaUseCaseDto: MediaUseCaseDto = MediaUseCaseDto.newFromMedia(media);
  
      expect(mediaUseCaseDto.id).toBe(media.getId());
      expect(mediaUseCaseDto.ownerId).toBe(media.getOwnerId());
      expect(mediaUseCaseDto.name).toBe(media.getName());
      expect(mediaUseCaseDto.type).toBe(media.getType());
      expect(mediaUseCaseDto.url).toBe(media.getMetadata().relativePath);
      expect(mediaUseCaseDto.createdAt).toBe(media.getCreatedAt().getTime());
      expect(mediaUseCaseDto.editedAt).toBe(media.getEditedAt()?.getTime());
    });
    
  });
  
  describe('newListFromMedias', () => {
    
    test('Expect it creates MediaUseCaseDto instances with required parameters', async () => {
      const media: Media = await createMedia();
      const mediaUseCaseDtos: MediaUseCaseDto[] = MediaUseCaseDto.newListFromMedias([media]);
  
      expect(mediaUseCaseDtos.length).toBe(1);
      expect(mediaUseCaseDtos[0].id).toBe(media.getId());
      expect(mediaUseCaseDtos[0].ownerId).toBe(media.getOwnerId());
      expect(mediaUseCaseDtos[0].name).toBe(media.getName());
      expect(mediaUseCaseDtos[0].type).toBe(media.getType());
      expect(mediaUseCaseDtos[0].url).toBe(media.getMetadata().relativePath);
      expect(mediaUseCaseDtos[0].createdAt).toBe(media.getCreatedAt().getTime());
      expect(mediaUseCaseDtos[0].editedAt).toBe(media.getEditedAt()?.getTime());
    });
    
  });
  
});

async function createMedia(): Promise<Media> {
  const createMediaEntityPayload: CreateMediaEntityPayload = {
    ownerId : v4(),
    name    : v4(),
    type    : MediaType.IMAGE,
    metadata: await FileMetadata.new({relativePath: '/relative/path'}),
    editedAt: new Date()
  };
  
  return Media.new(createMediaEntityPayload);
}
