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
import { Product } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../user/enum/roles.enum';
import {
  ApiOperation,
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(public service: ProductService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new unapproved product' })
  @ApiBody({ type: CreateProductDTO })
  @ApiOkResponse({ description: 'The product was created successfully' })
  @ApiBadRequestResponse({
    description:
      'The product with such naming already exists or category is unknown',
  })
  async create(
    @Req() req,
    @Body() createProductDto: CreateProductDTO,
  ): Promise<Product> {
    return this.service.create(+req.user['id'], createProductDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Delete('/delete/:productId')
  @ApiOperation({ summary: 'Delete pruct with given id' })
  @ApiParam({
    name: 'productId',
    required: true,
    description: 'Product identificator',
  })
  @ApiBadRequestResponse({ description: 'Product id is not provided' })
  async delete(@Param('productId') productId: string) {
    if (!productId) throw new BadRequestException('Invalid product id');
    return this.service.remove(+productId);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AccessTokenGuard)
  @Patch('/approve/:productId')
  @ApiOperation({ summary: 'Approve product to be accessible to everyone' })
  @ApiParam({
    name: 'productId',
    required: true,
    description: 'Product identificator',
  })
  @ApiBadRequestResponse({
    description:
      'Product id is not provided or product with such id doesn`t exist',
  })
  async approve(@Param('productId') productId: string) {
    if (!productId) throw new BadRequestException('Invalid product id');
    return this.service.approve(+productId);
  }
}
