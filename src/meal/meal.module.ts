import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { MealController } from './meal.controller';
import { Meal } from './meal.entity';
import { MealService } from './meal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal]), UserModule, ProductModule],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
