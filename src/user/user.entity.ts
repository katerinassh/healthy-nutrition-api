import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Min, Max } from 'class-validator';
import { GenderEnum } from './enum/gender.enum';
import { Product } from '../product/entities/product.entity';
import { RolesEnum } from './enum/roles.enum';
import { Meal } from '../meal/meal.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  @Min(1)
  @Max(5)
  activity: number;

  @Column({ nullable: true })
  calories: number;

  @Column({ nullable: true })
  protein: number;

  @Column({ nullable: true })
  fats: number;

  @Column({ nullable: true })
  carbohydrates: number;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'enum', enum: RolesEnum, nullable: false })
  role: RolesEnum;

  @OneToMany(() => Product, (product) => product.creator)
  products: Product[];

  @OneToMany(() => Meal, (meal) => meal.user)
  meals: Meal[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
