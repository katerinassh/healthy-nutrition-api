import { Controller, Get, Body, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateMeasurementsDTO } from './dto/updateMeasurements.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(public service: UserService) {}

    @Patch('/update-measurements')
    async updateMeasurements(@Body() updateMeasurementsDTO: UpdateMeasurementsDTO): Promise<User> {
      return this.service.updateMeasurements(updateMeasurementsDTO);
    }

    @Get('/macronutrient-ratios')
    async getMacronutrientRatios(
      @Query('id') id: string,
      @Query('aim') aim: string,
      @Query('weeks') weeks: string
      ): Promise<number> {
      return this.service.calculateMacronutrientRatios({ id: +id, aim, weeks });
    }
}