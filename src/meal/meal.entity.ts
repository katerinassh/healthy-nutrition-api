import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ConfiguredProduct } from '../product/entities/configuredProduct.entity';

@Entity({ name: 'meals' })
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.meals)
  @JoinColumn()
  user: User;

  @ManyToMany(
    () => ConfiguredProduct,
    (configuredProduct) => configuredProduct.meals,
  )
  @JoinTable()
  configuredProducts: ConfiguredProduct[];

  @Column({ nullable: false, type: 'float', default: 0.0 })
  totalCalories: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  totalFats: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  totalCarbohydrates: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  totalProtein: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
