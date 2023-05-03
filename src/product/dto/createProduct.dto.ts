import { IsOptional } from 'class-validator';
import { User } from 'src/user/user.entity';
import { CategoryEnum } from '../enum/category.enum';

export class CreateProductDTO {
  name: string;

  calories: number;

  fats: number;

  carbohydrates: number;

  protein: number;

  vitamins: JSON;

  containsTransFat?: boolean;

  category: CategoryEnum;

  brand?: string;

  @IsOptional()
  creator?: User;
}
