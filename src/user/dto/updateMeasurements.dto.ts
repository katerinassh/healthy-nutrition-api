import { ApiProperty } from '@nestjs/swagger';
import { Min, Max } from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';

export class UpdateMeasurementsDTO {
  @ApiProperty({ description: 'Gender', nullable: false, enum: GenderEnum })
  gender: GenderEnum;

  @ApiProperty({ description: 'Weight', nullable: false, type: 'number' })
  weight: number;

  @ApiProperty({ description: 'Height', nullable: false, type: 'number' })
  height: number;

  @ApiProperty({ description: 'Age', nullable: false, type: 'number' })
  age: number;

  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Level of activity, can be from 1 till 5',
    nullable: false,
    type: 'number',
  })
  activity: number;
}
