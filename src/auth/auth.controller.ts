import { Controller, Post, Get, Body, Req, UseGuards, Request } from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/createUser.dto';
import { SignInDTO } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}

    @Post('sign-up')
    signUp(@Body() createUserDto: CreateUserDTO): Promise<{ accessToken: string, refreshToken: string }> {
        return this.service.signUp(createUserDto);
    }

    @Post('sign-in')
    signIn(@Body() signInDto: SignInDTO): Promise<{ accessToken: string, refreshToken: string }> {
        return this.service.signIn(signInDto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    logOut(@Req() req): Promise<void> {
        return this.service.logOut(req.user['sub']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req): Promise<{ accessToken: string, refreshToken: string }> {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.service.refreshTokens(+userId, refreshToken);
      }
}