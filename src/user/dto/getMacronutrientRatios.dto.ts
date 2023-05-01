import { Aim } from '../enum/aim.enum';

export class CalculateCaloriesPerDayDTO {
  id: number;

  aim: Aim;

  weeks: number | null;
}
