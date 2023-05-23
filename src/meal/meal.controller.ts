import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../user/enum/roles.enum';
import { MealService } from './meal.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Meal')
@ApiBearerAuth()
@Controller('meal')
export class MealController {
  constructor(public service: MealService) {}

  @Roles(RolesEnum.Customer)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('/create')
  @HttpCode(201)
  async create(): Promise<void> {
    return;
  }

  @Roles(RolesEnum.Customer)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Put('/update')
  async update(): Promise<void> {
    return;
  }

  @Roles(RolesEnum.Customer)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('/get-for-day')
  async getForDay(): Promise<void> {
    return;
  }
}
