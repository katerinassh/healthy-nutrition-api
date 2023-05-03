import {
  Controller,
  Get,
  Body,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateMeasurementsDTO } from './dto/updateMeasurements.dto';
import { User } from './user.entity';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';

@Controller('user')
export class UserController {
  constructor(public service: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('/update-measurements')
  async updateMeasurements(
    @Req() req,
    @Body() updateMeasurementsDTO: UpdateMeasurementsDTO,
  ): Promise<User> {
    return this.service.updateMeasurements(
      +req.user['id'],
      updateMeasurementsDTO,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/macronutrient-ratios')
  async getMacronutrientRatios(
    @Req() req,
    @Query('aim') aim: string,
    @Query('weeks') weeks: string,
    @Query('idealWeight') idealWeight: string,
  ): Promise<{
    protein: number;
    fats: number;
    carbohydrates: number;
    calories: number;
    warning: string | null;
  }> {
    return this.service.calculateMacronutrientRatios({
      id: +req.user['id'],
      aim,
      weeks,
      idealWeight,
    });
  }
}
