import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from '../dto/createProduct.dto';
import { UserService } from '../../user/user.service';
import { CategoryEnum } from '../enum/category.enum';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private userService: UserService,
  ) {
    super(productRepository);
  }

  async create(userId: number, payload: CreateProductDTO): Promise<Product> {
    if (await this.exists(payload.name))
      throw new BadRequestException('Product exists in database');

    const ifCategoryKnown = !!Object.keys(CategoryEnum).find(
      (key) => CategoryEnum[key] === payload.category,
    );
    if (payload.category && !ifCategoryKnown)
      throw new BadRequestException('Unknown category');

    if (userId) {
      const creator = await this.userService.getById(userId);
      payload.creator = creator;
    }

    return this.productRepository.save(payload);
  }

  async remove(id: number) {
    return this.productRepository.delete(id);
  }

  async approve(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product)
      throw new BadRequestException('Product with such id do not exist');
    product.approved = true;
    return this.productRepository.save(product);
  }

  async exists(name: string): Promise<boolean> {
    return this.productRepository.exist({ where: { name } });
  }

  async getProductById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }
}
