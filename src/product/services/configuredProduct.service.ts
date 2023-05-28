import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguredProduct } from '../entities/configuredProduct.entity';
import { ConfiguredProductDTO } from '../dto/configuredProduct.dto';
import { ProductService } from './product.service';
import { Product } from '../entities/product.entity';

@Injectable()
export class ConfiguredProductService extends TypeOrmCrudService<ConfiguredProduct> {
  constructor(
    @InjectRepository(ConfiguredProduct)
    private configuredProductRepository: Repository<ConfiguredProduct>,
    private productService: ProductService,
  ) {
    super(configuredProductRepository);
  }

  async createConfiguredProduct(
    configuredProductDto: ConfiguredProductDTO,
  ): Promise<ConfiguredProduct> {
    const { productId } = configuredProductDto;
    const product = await this.productService.getProductById(productId);
    if (!product) throw new BadRequestException('Invalid product id');

    const sameConfiguration = await this.getTheSame(
      configuredProductDto,
      product,
    );
    if (sameConfiguration) return sameConfiguration;

    const { id } = await this.configuredProductRepository.save({
      ...configuredProductDto,
      product,
    });
    return this.configuredProductRepository.findOne({
      relations: {
        product: true,
      },
      where: { id },
    });
  }

  async getTheSame(
    configuredProductDto: ConfiguredProductDTO,
    product: Product,
  ): Promise<ConfiguredProduct | null> {
    const configuredProduct = await this.configuredProductRepository.findOne({
      relations: {
        product: true,
      },
      where: { quantity: configuredProductDto.quantity },
    });
    if (configuredProduct.product.id === product.id) {
      return configuredProduct;
    }
    return null;
  }
}
