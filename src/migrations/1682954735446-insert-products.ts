import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertProducts1682954735446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."category_type_enum" AS ENUM('Cheese', 'Fruits', 'Sandwiches & Burgers', 'Eggs', 'Meat');`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name varchar(100) UNIQUE NOT NULL,
          approved boolean NOT NULL DEFAULT true,
          calories float NOT NULL,
          fats float NOT NULL,
          carbohydrates float NOT NULL,
          protein float NOT NULL,
          vitamins json,
          contains_trans_fat boolean NOT NULL DEFAULT false,
          category "public"."category_type_enum" NOT NULL,
          brand varchar(50),
          "creatorId" int,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now(),
          FOREIGN KEY ("creatorId")
          REFERENCES users (id)
        );
        INSERT INTO products(name, calories, fats, carbohydrates, protein, vitamins, contains_trans_fat, category, brand)
        VALUES('Big Mac Burger', 550, 30, 45, 25, '{"calcium": 100, "potassium": 44, "iron": 5}', true, 'Sandwiches & Burgers', 'McDonalds');

        INSERT INTO products(name, calories, fats, carbohydrates, protein, vitamins, contains_trans_fat, category)
        VALUES('Egg raw', 143, 9.5, 0.7, 12.6, '{"calcium": 56, "potassium": 138, "iron": 2, "Vitamin A": 540, "Vitamin C": 0}', false, 'Eggs');

        INSERT INTO products(name, calories, fats, carbohydrates, protein, vitamins, contains_trans_fat, category)
        VALUES('Sweet Cherries', 63, 0.2, 16, 1.1, '{"calcium": 13, "potassium": 222, "iron": 0.5, "Vitamin A": 65, "Vitamin C": 7}', false, 'Fruits');

        INSERT INTO products(name, calories, fats, carbohydrates, protein, vitamins, contains_trans_fat, category)
        VALUES('Bananas', 89, 0.3, 22.8, 1.1, '{"calcium": 5, "potassium": 358, "iron": 0.5, "Vitamin A": 65, "Vitamin C": 9}', false, 'Fruits');

        INSERT INTO products(name, calories, fats, carbohydrates, protein, vitamins, contains_trans_fat, category)
        VALUES('Beef Sirloin Steak', 183, 5.8, 0, 30.6, '{"calcium": 20, "potassium": 393, "iron": 2, "Vitamin A": 0, "Vitamin A": 0}', false, 'Meat');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE products;`);
    await queryRunner.query(`DROP TYPE "public"."category_type_enum";`);
  }
}
