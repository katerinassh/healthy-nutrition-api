import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    Column,
  } from 'typeorm';
  import { Min } from 'class-validator';
  import { Product } from '../product/product.entity';
  
  @Entity('configured_products')
  export class ConfiguredProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Min(1)
    @Column()
    quantity: number;
  
    @ManyToOne(() => Product, (product: Product) => product.configurations)
    @JoinColumn()
    product: Product;
  }
  