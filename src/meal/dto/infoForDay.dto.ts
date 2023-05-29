import { ApiProperty } from '@nestjs/swagger';
import { Meal } from '../meal.entity';

export class InfoForDayDTO {
  date: Date;

  totalCaloriesConsumed: number;

  totalCaloriesForDay: number;

  totalFatsConsumed: number;

  totalFatsForDay: number;

  totalCarbohydratesConsumed: number;

  totalCarbohydratesForDay: number;

  totalProteinConsumed: number;

  totalProteinForDay: number;

  meals: Meal[];
}
