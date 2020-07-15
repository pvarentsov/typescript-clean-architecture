import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaTable1594769206476 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE MEDIA_TYPE_ENUM as ENUM ('IMAGE');
    `);
    
    await queryRunner.query(`
      CREATE TABLE public."media"(
        "id"           UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        "ownerId"      UUID NULL,
        "name"         VARCHAR(100) NULL,
        "type"         MEDIA_TYPE_ENUM NULL,
        "relativePath" VARCHAR(200) NULL,
        "size"         INT NULL,
        "ext"          VARCHAR(10) NULL,
        "mimetype"     VARCHAR(100) NULL,
        "createdAt"    TIMESTAMP WITH TIME ZONE NULL,
        "editedAt"     TIMESTAMP WITH TIME ZONE NULL,
        "removedAt"    TIMESTAMP WITH TIME ZONE NULL
      );
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."media";');
    await queryRunner.query('DROP TYPE MEDIA_TYPE_ENUM;');
  }

}
