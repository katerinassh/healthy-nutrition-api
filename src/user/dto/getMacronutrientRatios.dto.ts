import { AimEnum } from '../enum/aim.enum';

export class CalculateCaloriesPerDayDTO {
  id: number;

  aim: AimEnum;

  weeks: number | null;
}
