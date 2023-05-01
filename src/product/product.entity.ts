import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './enum/category.enum';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  approved: boolean;

  @Column()
  calories: number;

  @Column()
  fats: number;

  @Column()
  carbohydrates: number;

  @Column()
  protein: number;

  @Column('jsonb', { nullable: false, default: {} })
  vitamins: string;

  @Column({ name: 'contains_trans_fat', default: false })
  containsTransFat: boolean;

  @Column({
    type: 'enum',
    enum: Category,
  })
  category: string;

  @Column()
  brand?: string;

  @ManyToOne(() => User, (user: User) => user.products)
  @JoinColumn()
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
