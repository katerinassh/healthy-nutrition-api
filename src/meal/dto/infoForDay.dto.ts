import { ApiProperty } from '@nestjs/swagger';
import { Meal } from '../meal.entity';

export class InfoForDayDTO {
  @ApiProperty({
    description: 'Date in format YYYY-MM-DD',
    nullable: false,
    type: 'date',
  })
  date: Date;

  @ApiProperty({
    description: 'Calories amount which user already consumed this day',
    nullable: false,
    type: 'number',
  })
  totalCaloriesConsumed: number;

  @ApiProperty({
    description:
      'Overall calories amount which is recommended for a user per day',
    nullable: false,
    type: 'number',
  })
  totalCaloriesForDay: number;

  @ApiProperty({
    description: 'Fats amount which user already consumed this day',
    nullable: false,
    type: 'number',
  })
  totalFatsConsumed: number;

  @ApiProperty({
    description: 'Overall fats amount which is recommended for a user per day',
    nullable: false,
    type: 'number',
  })
  totalFatsForDay: number;

  @ApiProperty({
    description: 'Carbohydrates amount which user already consumed this day',
    nullable: false,
    type: 'number',
  })
  totalCarbohydratesConsumed: number;

  @ApiProperty({
    description:
      'Overall carbohydrates amount which is recommended for a user per day',
    nullable: false,
    type: 'number',
  })
  totalCarbohydratesForDay: number;

  @ApiProperty({
    description: 'Protein amount which user already consumed this day',
    nullable: false,
    type: 'number',
  })
  totalProteinConsumed: number;

  @ApiProperty({
    description:
      'Overall protein amount which is recommended for a user per day',
    nullable: false,
    type: 'number',
  })
  totalProteinForDay: number;

  @ApiProperty({
    description: 'Meals already added by user',
    nullable: false,
    type: 'array',
  })
  meals: Meal[];
}
