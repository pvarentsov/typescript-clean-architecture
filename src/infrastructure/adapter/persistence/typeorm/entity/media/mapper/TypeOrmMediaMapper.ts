import { Media } from '@core/domain/media/entity/Media';
import { FileMetadata } from '@core/domain/media/value-object/FileMetadata';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/TypeOrmMedia';

export class TypeOrmMediaMapper {
  
  public static toOrmEntity(domainMedia: Media): TypeOrmMedia {
    const ormMedia: TypeOrmMedia = new TypeOrmMedia();
    
    ormMedia.id           = domainMedia.getId();
    ormMedia.ownerId      = domainMedia.getOwnerId();
    ormMedia.name         = domainMedia.getName();
    ormMedia.type         = domainMedia.getType();
    
    ormMedia.relativePath = domainMedia.getMetadata().relativePath;
    ormMedia.size         = domainMedia.getMetadata().size as number;
    ormMedia.ext          = domainMedia.getMetadata().ext as string;
    ormMedia.mimetype     = domainMedia.getMetadata().mimetype as string;
    
    ormMedia.createdAt    = domainMedia.getCreatedAt();
    ormMedia.editedAt     = domainMedia.getEditedAt() as Date;
    ormMedia.removedAt    = domainMedia.getRemovedAt() as Date;
    
    return ormMedia;
  }
  
  public static toOrmEntities(domainMedias: Media[]): TypeOrmMedia[] {
    return domainMedias.map(domainMedia => this.toOrmEntity(domainMedia));
  }
  
  public static toDomainEntity(ormMedia: TypeOrmMedia): Media {
    const metadata: FileMetadata = new FileMetadata({
      relativePath: ormMedia.relativePath,
      size        : ormMedia.size,
      ext         : ormMedia.ext,
      mimetype    : ormMedia.mimetype,
    });
    
    const domainMedia: Media = new Media({
      ownerId  : ormMedia.ownerId,
      name     : ormMedia.name,
      type     : ormMedia.type,
      metadata : metadata,
      id       : ormMedia.id,
      createdAt: ormMedia.createdAt,
      editedAt : ormMedia.editedAt,
      removedAt: ormMedia.removedAt,
    });
    
    return domainMedia;
  }
  
  public static toDomainEntities(ormMedias: TypeOrmMedia[]): Media[] {
    return ormMedias.map(ormMedia => this.toDomainEntity(ormMedia));
  }
  
}
