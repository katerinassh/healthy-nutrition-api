import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/createProduct.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../user/enum/roles.enum';

@Controller('product')
export class ProductController {
  constructor(public service: ProductService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create')
  @HttpCode(201)
  async create(
    @Req() req,
    @Body() createProductDto: CreateProductDTO,
  ): Promise<Product> {
    return this.service.create(+req.user['id'], createProductDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete('/delete/:productId')
  async delete(@Param('productId') productId: string) {
    if (!productId) throw new BadRequestException('Invalid product id');
    return this.service.remove(+productId);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AccessTokenGuard)
  @Patch('/approve/:productId')
  async approve(@Param('productId') productId: string) {
    if (!productId) throw new BadRequestException('Invalid product id');
    return this.service.approve(+productId);
  }
}
