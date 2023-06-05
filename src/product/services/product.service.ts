import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from '../dto/createProduct.dto';
import { UserService } from '../../user/user.service';
import { CategoryEnum } from '../enum/category.enum';
import { GetListDTO } from '../dto/getList.dto';
import { SortEnum } from '../enum/sort.enum';

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
    const product = await this.getProductById(id);
    if (product && !product.inUse) {
      return this.productRepository.delete(id);
    }
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

  async makeInUse(id: number): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product)
      throw new BadRequestException('Product with such id do not exist');
    product.inUse = true;
    return this.productRepository.save(product);
  }

  async getProductsList(getListDto: GetListDTO): Promise<{
    productList: Product[];
    total: number;
  }> {
    const { productsForPage, page, sortBy, search, userId } = getListDto;
    let query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.creator', 'creator')
      .where({ approved: true })
      .skip(productsForPage * (page - 1))
      .take(productsForPage);

    if (userId) {
      query.andWhere({ creator: userId });
    }
    const searchInLowCase = search.toLowerCase();
    console.log(searchInLowCase)
    query =
      searchInLowCase === ''
        ? query
        : query.andWhere(`(LOWER(product.name) like :name)`, {
            name: `%${ searchInLowCase }%`,
          });

    const [result, total] = await query
      .orderBy('product.updatedAt', 'DESC')
      .getManyAndCount();

    if (result.length >= 500)
      throw new BadRequestException('Unhandled products amount');

    if (sortBy) {
      switch (sortBy) {
        case SortEnum.Calories:
          result.sort((a, b) => a.calories - b.calories);
          break;
        case SortEnum.Fats:
          result.sort((a, b) => a.fats - b.fats);
          break;
        case SortEnum.Carbohydrates:
          result.sort((a, b) => a.carbohydrates - b.carbohydrates);
          break;
        case SortEnum.Protein:
          result.sort((a, b) => a.protein - b.protein);
          break;
        default:
          break;
      }
    }

    return { productList: result, total };
  }
}
