import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/createProduct.dto';
import { UserService } from '../user/user.service';
import { CategoryEnum } from './enum/category.enum';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
    private userService: UserService,
  ) {
    super(repository);
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

    return this.repository.save(payload);
  }

  async remove(id: number) {
    return this.repository.delete(id);
  }

  async approve(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product)
      throw new BadRequestException('Product with such id do not exist');
    product.approved = true;
    return this.repository.save(product);
  }

  async exists(name: string): Promise<boolean> {
    return this.repository.exist({ where: { name } });
  }

  async getProductById(id: number): Promise<Product> {
    return this.repository.findOne({ where: { id } });
  }
}
