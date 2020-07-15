import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1594770165389 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE POST_STATUS_ENUM as ENUM ('DRAFT', 'PUBLISHED');
    `);
        
    await queryRunner.query(`
      CREATE TABLE public."post"(
        "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        "ownerId"     UUID NULL,
        "title"       VARCHAR(100) NULL,
        "imageId"     UUID NULL,
        "content"     VARCHAR(10000) NULL,
        "status"      POST_STATUS_ENUM NULL,
        "createdAt"   TIMESTAMP WITH TIME ZONE NULL,
        "editedAt"    TIMESTAMP WITH TIME ZONE NULL,
        "publishedAt" TIMESTAMP WITH TIME ZONE NULL,
        "removedAt"   TIMESTAMP WITH TIME ZONE NULL
      );
    `);
  }
    
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."post";');
    await queryRunner.query('DROP TYPE POST_STATUS_ENUM;');
  }

}
