import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UpdateMealWithProductsDTO } from './dto/updateMealWithProducts.dto';
import { ConfiguredProductService } from '../product/services/configuredProduct.service';
import { ConfiguredProduct } from '../product/entities/configuredProduct.entity';
import { InfoForDayDTO } from './dto/infoForDay.dto';
import * as moment from 'moment';

@Injectable()
export class MealService extends TypeOrmCrudService<Meal> {
  constructor(
    @InjectRepository(Meal)
    private repository: Repository<Meal>,
    private userService: UserService,
    private configuredProductService: ConfiguredProductService,
  ) {
    super(repository);
  }

  async create(userId: number): Promise<Meal> {
    const user = await this.userService.getById(userId);
    if (!user) throw new BadRequestException('User does`t exist');
    return this.repository.save({ user, configuredProducts: [] });
  }

  recalculateTotals(configuredProducts: ConfiguredProduct[]): {
    totalCalories: number;
    totalFats: number;
    totalCarbohydrates: number;
    totalProtein: number;
  } {
    const totals = {
      totalCalories: 0,
      totalFats: 0,
      totalCarbohydrates: 0,
      totalProtein: 0,
    };
    configuredProducts.forEach((item) => {
      totals.totalCalories += (item.product.calories / 100) * item.quantity;
      totals.totalFats += (item.product.fats / 100) * item.quantity;
      totals.totalCarbohydrates +=
        (item.product.carbohydrates / 100) * item.quantity;
      totals.totalProtein += (item.product.protein / 100) * item.quantity;
    });
    return totals;
  }

  async updateProducts(
    userId: number,
    updateMealWithProductsDto: UpdateMealWithProductsDTO,
  ): Promise<Meal> {
    const { mealId, configuredProducts } = updateMealWithProductsDto;
    const meal = await this.repository.findOne({
      relations: {
        user: true,
      },
      where: { id: mealId },
    });
    if (!meal) throw new BadRequestException('Invalid meal id');

    const user = await this.userService.getById(userId);
    if (!user || meal.user.id !== userId) {
      throw new ForbiddenException(
        'User doesn`t have access to update this meal',
      );
    }

    const addedProducts = [];
    for (const cf of configuredProducts) {
      const addedProduct =
        await this.configuredProductService.createConfiguredProduct(cf);
      addedProducts.push(addedProduct);
    }

    const totals = this.recalculateTotals(addedProducts);
    await this.repository.save({
      ...meal,
      ...totals,
      configuredProducts: addedProducts,
    });

    return this.repository
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.configuredProducts', 'configuredProducts')
      .leftJoinAndSelect('configuredProducts.product', 'product')
      .where('meal.id = :id', {
        id: meal.id,
      })
      .getOne();
  }

  async getForDay(userId: number, day: string): Promise<InfoForDayDTO> {
    const user = await this.userService.getById(userId);

    const nextDay = moment(day).add(1, 'd').utcOffset(0, true).toISOString();
    const meals = await this.repository
      .createQueryBuilder('meal')
      .where('meal.userId = :userId', { userId })
      .andWhere('meal.created_at >= :day', { day: `%${day}%` })
      .andWhere('meal.created_at < :nextDay', { nextDay: `%${nextDay}%` })
      .leftJoinAndSelect('meal.configuredProducts', 'configuredProducts')
      .leftJoinAndSelect('configuredProducts.product', 'product')
      .getMany();

    const totalsConsumed = {
      totalCaloriesConsumed: 0,
      totalFatsConsumed: 0,
      totalCarbohydratesConsumed: 0,
      totalProteinConsumed: 0,
    };
    meals.forEach((meal) => {
      totalsConsumed.totalCaloriesConsumed += meal.totalCalories;
      totalsConsumed.totalFatsConsumed += meal.totalFats;
      totalsConsumed.totalCarbohydratesConsumed += meal.totalCarbohydrates;
      totalsConsumed.totalProteinConsumed += meal.totalProtein;
    });

    return this.toInfoForDay(day, meals, user, totalsConsumed);
  }

  toInfoForDay(
    day: string,
    meals: Meal[],
    user: User,
    totalsConsumed,
  ): InfoForDayDTO {
    return {
      ...totalsConsumed,
      date: moment(day).format('YYYY-MM-DD'),
      totalCaloriesForDay: user.calories,
      totalFatsForDay: user.fats,
      totalCarbohydratesForDay: user.carbohydrates,
      totalProteinForDay: user.protein,
      meals,
    };
  }
}
