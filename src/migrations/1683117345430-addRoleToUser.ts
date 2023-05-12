import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUser1683117345430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TYPE IF EXISTS public.roles_type_enum;
        CREATE TYPE public.roles_type_enum AS ENUM ('admin', 'customer');`,
    );
    await queryRunner.query(
      'ALTER TABLE users ADD COLUMN role public.roles_type_enum;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE users DROP COLUMN role');
    await queryRunner.query(`DROP TYPE public.roles_type_enum;`);
  }
}
