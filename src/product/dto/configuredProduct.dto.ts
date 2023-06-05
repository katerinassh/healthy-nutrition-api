import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class ConfiguredProductDTO {
  @ApiProperty({
    description: 'Product unique indentificator',
    nullable: false,
    type: 'number',
  })
  productId: number;

  @ApiProperty({
    description: 'Grams of product',
    nullable: false,
    type: 'number',
  })
  @Min(1)
  quantity: number;
}
