import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';

@Injectable()
export class MealService extends TypeOrmCrudService<Meal> {
  constructor(
    @InjectRepository(Meal)
    private repository: Repository<Meal>,
  ) {
    super(repository);
  }
}
