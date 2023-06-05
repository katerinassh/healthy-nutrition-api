import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsOptional, Max, Min } from 'class-validator';
import { SortEnum } from '../enum/sort.enum';

export class GetListDTO {
  @ApiProperty({
    description: 'Products for a page',
    nullable: false,
    type: 'number',
  })
  @Min(1)
  @Max(100)
  productsForPage: number;

  @ApiProperty({
    description: 'Page number which products are returned',
    nullable: false,
    type: 'number',
  })
  @Min(1)
  page: number;

  @ApiPropertyOptional({
    description: 'Criteria for sorting',
    nullable: true,
    enum: SortEnum,
  })
  @IsOptional()
  sortBy?: SortEnum;

  @ApiPropertyOptional({
    description: 'Search line',
    nullable: true,
    type: 'string',
    default: ''
  })
  search: string;

  @ApiPropertyOptional({
    description: 'User identificator',
    nullable: true,
    type: 'number',
  })
  userId?: number;
}
