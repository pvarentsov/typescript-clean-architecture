import { MediaType } from '@core/common/enums/MediaEnums';
import { Nullable } from '@core/common/type/CommonTypes';
import { Media } from '@core/domain/media/entity/Media';
import { Exclude, Expose, plainToClass } from 'class-transformer';

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
  
  public static newFromMedia(media: Media): MediaUseCaseDto {
    const dto: MediaUseCaseDto = plainToClass(MediaUseCaseDto, media);
    
    dto.url = media.getMetadata().relativePath;
    dto.createdAt = media.getCreatedAt().getTime();
    dto.editedAt = media.getEditedAt()?.getTime() || null;
    
    return dto;
  }
  
  public static newListFromMedias(medias: Media[]): MediaUseCaseDto[] {
    return medias.map(media => this.newFromMedia(media));
  }
  
}
