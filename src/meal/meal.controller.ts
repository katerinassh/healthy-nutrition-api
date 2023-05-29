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
  BadRequestException,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from '../user/enum/roles.enum';
import { MealService } from './meal.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create new meal without products' })
  @ApiCreatedResponse({ description: 'The meal was created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid user' })
  async create(@Req() req): Promise<Meal> {
    return this.service.create(+req.user['id']);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/update-products')
  @ApiOperation({ summary: 'Add consumed products to a meal' })
  @ApiBody({ type: UpdateMealWithProductsDTO })
  @ApiOkResponse({
    description: 'The meal was updated successfully with products',
  })
  @ApiBadRequestResponse({ description: 'Invalid meal' })
  @ApiForbiddenResponse({ description: 'Invalid user' })
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
  @ApiOperation({ summary: 'Get calories statistic for a paticular day' })
  @ApiQuery({
    name: 'day',
    required: true,
    description: 'Day for which statistic need to be got',
  })
  @ApiOkResponse({ description: 'The data was returned' })
  @ApiBadRequestResponse({ description: 'Day was not provided inside query' })
  async getForDay(
    @Req() req,
    @Query('day') day: string,
  ): Promise<InfoForDayDTO> {
    if (!day) throw new BadRequestException('Day must be provided');
    return this.service.getForDay(+req.user['id'], day);
  }
}
