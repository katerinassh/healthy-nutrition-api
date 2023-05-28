import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConfiguredProduct } from './entities/configuredProduct.entity';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { ConfiguredProductService } from './services/configuredProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ConfiguredProduct]), UserModule],
  controllers: [ProductController],
  providers: [ProductService, ConfiguredProductService],
  exports: [ProductService, ConfiguredProductService],
})
export class ProductModule {}
