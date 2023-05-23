import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/user.entity';
import { CategoryEnum } from '../enum/category.enum';

export class CreateProductDTO {
  @ApiProperty({ description: 'Product name', nullable: false, type: 'string' })
  name: string;

  @ApiProperty({
    description: 'Calories per 100 g in product',
    nullable: false,
    type: 'number',
  })
  calories: number;

  @ApiProperty({
    description: 'Amount of fats per 100 g in product',
    nullable: false,
    type: 'number',
  })
  fats: number;

  @ApiProperty({
    description: 'Amount of carbohydrates per 100 g in product',
    nullable: false,
    type: 'number',
  })
  carbohydrates: number;

  @ApiProperty({
    description: 'Amount of protein per 100 g in product',
    nullable: false,
    type: 'number',
  })
  protein: number;

  @ApiProperty({
    description: 'Json with different vitamins in product (per 100 g)',
    nullable: false,
    type: 'json',
  })
  vitamins: JSON;

  @ApiPropertyOptional({
    description: 'If product contains trans fats',
    nullable: true,
    type: 'boolean',
  })
  containsTransFat?: boolean;

  @ApiProperty({
    description: 'Product category',
    nullable: false,
    enum: CategoryEnum,
  })
  category: CategoryEnum;

  @ApiProperty({
    description: 'Brand which produce a product',
    nullable: false,
    type: 'string',
  })
  brand?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'A user (id) who created this product',
    nullable: true,
    type: User,
  })
  creator?: User;
}
