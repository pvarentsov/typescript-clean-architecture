import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1594856827930 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE USER_ROLE_ENUM as ENUM ('ADMIN', 'AUTHOR', 'GUEST');
    `);
    
    await queryRunner.query(`
      CREATE TABLE public."user"(
        "id"        UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
        "firstName" VARCHAR(100) NULL,
        "lastName"  VARCHAR(100) NULL,
        "email"     VARCHAR(100) NULL,
        "role"      USER_ROLE_ENUM NULL,
        "password"  VARCHAR(200) NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NULL,
        "editedAt"  TIMESTAMP WITH TIME ZONE NULL,
        "removedAt" TIMESTAMP WITH TIME ZONE NULL
      );
    `);
  }
  
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."user";');
    await queryRunner.query('DROP TYPE USER_ROLE_ENUM;');
  }
  
}
