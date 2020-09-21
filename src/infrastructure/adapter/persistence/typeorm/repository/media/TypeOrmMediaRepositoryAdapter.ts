import { RepositoryFindOptions, RepositoryRemoveOptions } from '@core/common/persistence/RepositoryOptions';
import { Optional } from '@core/common/type/CommonTypes';
import { Media } from '@core/domain/media/entity/Media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/MediaRepositoryPort';
import { TypeOrmMediaMapper } from '@infrastructure/adapter/persistence/typeorm/entity/media/mapper/TypeOrmMediaMapper';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/TypeOrmMedia';
import { EntityRepository, InsertResult, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(TypeOrmMedia)
export class TypeOrmMediaRepositoryAdapter extends BaseRepository<TypeOrmMedia> implements MediaRepositoryPort {
  
  private readonly mediaAlias: string = 'media';
  
  private readonly excludeRemovedMediaClause: string = `"${this.mediaAlias}"."removedAt" IS NULL`;
  
  public async findMedia(by: {id?: string}, options: RepositoryFindOptions = {}): Promise<Optional<Media>> {
    let domainEntity: Optional<Media>;
    
    const query: SelectQueryBuilder<TypeOrmMedia> = this.buildMediaQueryBuilder();
  
    this.extendQueryWithByProperties(by, query);
    
    if (!options.includeRemoved) {
      query.andWhere(this.excludeRemovedMediaClause);
    }
    
    const ormEntity: Optional<TypeOrmMedia> = await query.getOne();
    
    if (ormEntity) {
      domainEntity = TypeOrmMediaMapper.toDomainEntity(ormEntity);
    }
    
    return domainEntity;
  }
  
  public async findMedias(by: {ownerId?: string}, options: RepositoryFindOptions = {}): Promise<Media[]> {
    const query: SelectQueryBuilder<TypeOrmMedia> = this.buildMediaQueryBuilder();
  
    this.extendQueryWithByProperties(by, query);
    
    if (!options.includeRemoved) {
      query.andWhere(this.excludeRemovedMediaClause);
    }
    if (options.limit) {
      query.limit(options.limit);
    }
    if (options.offset) {
      query.limit(options.offset);
    }
    
    const ormMedias: TypeOrmMedia[] = await query.getMany();
    const domainMedias: Media[] = TypeOrmMediaMapper.toDomainEntities(ormMedias);
    
    return domainMedias;
  }
  
  public async countMedias(by: {id?: string, ownerId?: string}, options: RepositoryFindOptions = {}): Promise<number> {
    const query: SelectQueryBuilder<TypeOrmMedia> = this.buildMediaQueryBuilder();
  
    this.extendQueryWithByProperties(by, query);
    
    if (!options.includeRemoved) {
      query.andWhere(this.excludeRemovedMediaClause);
    }
    
    return query.getCount();
  }
  
  public async addMedia(media: Media): Promise<{id: string}> {
    const ormMedia: TypeOrmMedia = TypeOrmMediaMapper.toOrmEntity(media);
  
    const insertResult: InsertResult = await this
      .createQueryBuilder(this.mediaAlias)
      .insert()
      .into(TypeOrmMedia)
      .values([ormMedia])
      .execute();
  
    return {
      id: insertResult.identifiers[0].id
    };
  }
  
  public async updateMedia(media: Media): Promise<void>{
    const ormMedia: TypeOrmMedia = TypeOrmMediaMapper.toOrmEntity(media);
    await this.update(ormMedia.id, ormMedia);
  }
  
  public async removeMedia(media: Media, options: RepositoryRemoveOptions = {}): Promise<void> {
    await media.remove();
    const ormMedia: TypeOrmMedia = TypeOrmMediaMapper.toOrmEntity(media);
    
    if (options.disableSoftDeleting) {
      await this.delete(ormMedia);
    }
    if (!options.disableSoftDeleting) {
      await this.update(ormMedia.id, ormMedia);
    }
  }
  
  private buildMediaQueryBuilder(): SelectQueryBuilder<TypeOrmMedia> {
    return this
      .createQueryBuilder(this.mediaAlias)
      .select();
  }
  
  private extendQueryWithByProperties(by: {id?: string, ownerId?: string}, query: SelectQueryBuilder<TypeOrmMedia>): void {
    if (by.id) {
      query.andWhere(`"${this.mediaAlias}"."id" = :id`, {id: by.id});
    }
    if (by.ownerId) {
      query.andWhere(`"${this.mediaAlias}"."ownerId" = :ownerId`, {ownerId: by.ownerId});
    }
  }
  
}
