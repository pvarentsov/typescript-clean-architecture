import { MediaType } from '../../../../shared/enums/MediaEnums';
import { Nullable } from '../../../../shared/type/CommonTypes';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Media } from '../../entity/Media';

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
  
  @Expose()
  public relativePath: string;
  
  @Expose()
  public createdAt: Date;
  
  @Expose()
  public editedAt: Nullable<Date>;
  
  @Expose()
  public publishedAt: Nullable<Date>;
  
  public static newFromMedia(media: Media): MediaUseCaseDto {
    const dto: MediaUseCaseDto = plainToClass(MediaUseCaseDto, media);
    dto.relativePath = media.getMetadata().relativePath;
    
    return dto;
  }
  
  public static newListFromMedias(medias: Media[]): MediaUseCaseDto[] {
    return medias.map(media => this.newFromMedia(media));
  }
  
}
