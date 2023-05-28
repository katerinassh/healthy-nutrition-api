import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  ManyToMany,
} from 'typeorm';
import { Min } from 'class-validator';
import { Product } from './product.entity';
import { Meal } from 'src/meal/meal.entity';

@Entity('configured_products')
export class ConfiguredProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Min(1)
  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.configurations)
  @JoinColumn()
  product: Product;

  @ManyToMany(() => Meal, (meal) => meal.configuredProducts)
  meals: Meal[];
}
