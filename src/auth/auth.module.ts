import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  GoogleStrategy,
} from './strategies';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule.register({}), UserModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
