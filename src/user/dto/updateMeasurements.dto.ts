import { Min, Max } from 'class-validator';
import { Gender } from '../enum/gender.enum';

export class UpdateMeasurementsDTO {
    gender: Gender;

    weight: number;

    height: number;

    age: number;

    @Min(1)
    @Max(5)
    activity: number;
}