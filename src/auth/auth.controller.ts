import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { CreateCustomerDTO } from '../user/dto/createCustomer.dto';
import { SignInDTO } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('customer-sign-up')
  signUp(
    @Body() createCustomerDto: CreateCustomerDTO,
  ): Promise<{ accessToken: string; refreshToken: string, user: User }> {
    return this.service.customerSignUp(createCustomerDto);
  }

  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.service.signIn(signInDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logOut(@Req() req): Promise<void> {
    return this.service.logOut(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @Req() req,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.service.refreshTokens(+userId, refreshToken);
  }
}
