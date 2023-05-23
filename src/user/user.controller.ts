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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AimEnum } from './enum/aim.enum';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(public service: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Patch('/update-measurements')
  @ApiOperation({
    summary:
      'Update user measurements such as gender, weight, height, age, activity',
  })
  @ApiBody({ type: UpdateMeasurementsDTO })
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiNotFoundResponse({ description: 'User is not found' })
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
  @ApiOperation({
    summary:
      'Return daily amount of protein, fats, carbohydrates and calories for a user',
  })
  @ApiQuery({
    name: 'aim',
    required: false,
    description: 'Aim',
    enum: Object.keys(AimEnum),
  })
  @ApiQuery({
    name: 'weeks',
    required: false,
    description: 'Number of weeks to desired weight',
  })
  @ApiQuery({
    name: 'idealWeight',
    required: false,
    description: 'Ideal weight',
  })
  @ApiOkResponse({ description: 'Data was returned successfully' })
  @ApiBadRequestResponse({
    description: 'User must firstly update measurements',
  })
  @ApiNotFoundResponse({ description: 'User is not found' })
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
