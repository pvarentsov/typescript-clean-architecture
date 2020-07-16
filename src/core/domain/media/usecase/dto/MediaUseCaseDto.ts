import { MediaType } from '../../../../common/enums/MediaEnums';
import { Nullable } from '../../../../common/type/CommonTypes';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Media } from '../../entity/Media';
import { resolve } from 'url';

@Exclude()
export class MediaUseCaseDto {

  @Expose()
  public id: string;
  
  @Expose()
  public ownerId: string;
  
  @Expose()
  public name: string;
  
  @Expose()
  public type: MediaType;
  
  public url: string;
  
  public createdAt: number;
  
  public editedAt: Nullable<number>;
  
  public static newFromMedia(media: Media, options?: {storageBasePath?: string}): MediaUseCaseDto {
    const dto: MediaUseCaseDto = plainToClass(MediaUseCaseDto, media);
    
    dto.url = options?.storageBasePath
      ? resolve(options?.storageBasePath, media.getMetadata().relativePath)
      : media.getMetadata().relativePath;
    
    dto.createdAt = media.getCreatedAt().getTime();
    dto.editedAt = media.getEditedAt()?.getTime() || null;
    
    return dto;
  }
  
  public static newListFromMedias(medias: Media[],options?: {storageBasePath?: string}): MediaUseCaseDto[] {
    return medias.map(media => this.newFromMedia(media, options));
  }
  
}
