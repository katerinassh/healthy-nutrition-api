import { ApiProperty } from '@nestjs/swagger';
import { ConfiguredProductDTO } from 'src/product/dto/configuredProduct.dto';

export class UpdateMealWithProductsDTO {
  @ApiProperty({
    description: 'Meal identificator',
    nullable: false,
    type: 'number',
  })
  mealId: number;

  configuredProducts: ConfiguredProductDTO[];
}
