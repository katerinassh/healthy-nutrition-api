import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateCustomerDTO } from '../user/dto/createCustomer.dto';
import { SignInDTO } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { User } from '../user/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../user/enum/roles.enum';
import { CompleteRegistrationDTO } from './dto/completeRegistration.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('customer-sign-up')
  signUp(
    @Body() createCustomerDto: CreateCustomerDTO,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
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

  @Roles(RolesEnum.Admin)
  @UseGuards(AccessTokenGuard)
  @Post('invite-admin')
  inviteAdmin(@Body('email') email: string): Promise<void> {
    return this.service.inviteAdmin(email);
  }

  @Patch('complete-registration')
  completeRegistration(
    @Query('token') token: string,
    @Body() completeRegistrationDto: CompleteRegistrationDTO,
  ): Promise<User> {
    return this.service.completeRegistration(token, completeRegistrationDto);
  }
}
