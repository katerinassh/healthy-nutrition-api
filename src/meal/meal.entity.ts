import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ConfiguredProduct } from '../product/configuredProduct.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'meals' })
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.meals)
  @JoinColumn()
  user: User;

  @IsOptional()
  @Column('int', { array: true })
  configuredProducts: ConfiguredProduct[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
