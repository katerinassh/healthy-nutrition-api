import { ApiProperty } from '@nestjs/swagger';
import { ConfiguredProductDTO } from 'src/product/dto/configuredProduct.dto';

export class UpdateMealWithProductsDTO {
  @ApiProperty({
    description: 'Meal identificator',
    nullable: false,
    type: 'number',
  })
  mealId: number;

  @ApiProperty({
    description: 'Array of new adding products',
    nullable: false,
    type: ConfiguredProductDTO,
  })
  configuredProducts: ConfiguredProductDTO[];
}
