import { Min, Max } from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';

export class UpdateMeasurementsDTO {
  gender: GenderEnum;

  weight: number;

  height: number;

  age: number;

  @Min(1)
  @Max(5)
  activity: number;
}
