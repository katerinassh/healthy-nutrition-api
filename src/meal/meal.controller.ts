import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Put,
  Get,
  Req,
  Body,
  Query,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../user/enum/roles.enum';
import { MealService } from './meal.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Meal } from './meal.entity';
import { UpdateMealWithProductsDTO } from './dto/updateMealWithProducts.dto';
import { InfoForDayDTO } from './dto/infoForDay.dto';

@ApiTags('Meal')
@ApiBearerAuth()
@Controller('meal')
export class MealController {
  constructor(public service: MealService) {}

  @Roles(RolesEnum.Customer)
  @UseGuards(AccessTokenGuard)
  @Post('/create')
  @HttpCode(201)
  async create(@Req() req): Promise<Meal> {
    return this.service.create(+req.user['id']);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/update-products')
  async updateProducts(
    @Req() req,
    @Body() updateMealWithProductsDto: UpdateMealWithProductsDTO,
  ): Promise<Meal> {
    return this.service.updateProducts(
      +req.user['id'],
      updateMealWithProductsDto,
    );
  }

  @Roles(RolesEnum.Customer)
  @UseGuards(AccessTokenGuard)
  @Get('/get-for-day')
  async getForDay(
    @Req() req,
    @Query('day') day: string
  ): Promise<InfoForDayDTO> {
    return this.service.getForDay(+req.user['id'], day);
  }
}
