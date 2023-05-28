import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class ConfiguredProductDTO {
  @ApiProperty({
    description: 'Meal unique indentificator',
    nullable: false,
    type: 'number',
  })
  productId: number;

  @Min(1)
  quantity: number;
}
