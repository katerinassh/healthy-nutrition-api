import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ConfiguredProduct } from './configuredProduct.entity';
import { CategoryEnum } from './enum/category.enum';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ default: true })
  approved: boolean;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  calories: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  fats: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  carbohydrates: number;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  protein: number;

  @Column('jsonb', { nullable: false, default: {} })
  vitamins: JSON;

  @Column({ name: 'contains_trans_fat', default: false })
  containsTransFat: boolean;

  @Column({
    type: 'enum',
    enum: CategoryEnum,
  })
  category: CategoryEnum;

  @Column({ nullable: true })
  brand: string;

  @Column({ name: 'in_use', default: false })
  inUse: boolean;

  @ManyToOne(() => User, (user: User) => user.products)
  @JoinColumn()
  creator: User;

  @OneToMany(() => ConfiguredProduct, (cp: ConfiguredProduct) => cp.product)
  configurations: ConfiguredProduct;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
