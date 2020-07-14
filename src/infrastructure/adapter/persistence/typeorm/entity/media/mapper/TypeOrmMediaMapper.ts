import { Media } from '../../../../../../../core/domain/media/entity/Media';
import { FileMetadata } from '../../../../../../../core/domain/media/value-object/FileMetadata';
import { TypeOrmMedia } from '../TypeOrmMedia';

export class TypeOrmMediaMapper {
  
  public static createOrmEntity(domainMedia: Media): TypeOrmMedia {
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
  
  public static createOrmEntities(domainMedias: Media[]): TypeOrmMedia[] {
    return domainMedias.map(domainMedia => this.createOrmEntity(domainMedia));
  }
  
  public static async createDomainEntity(ormMedia: TypeOrmMedia): Promise<Media> {
    const metadata: FileMetadata = await FileMetadata.new({
      relativePath: ormMedia.relativePath,
      size        : ormMedia.size,
      ext         : ormMedia.ext,
      mimetype    : ormMedia.mimetype,
    });
    
    const domainMedia: Media = await Media.new({
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
  
  public static async createDomainEntities(ormMedias: TypeOrmMedia[]): Promise<Media[]> {
    return Promise.all(ormMedias.map(async ormMedia => this.createDomainEntity(ormMedia)));
  }
  
}
