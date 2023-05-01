import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDTO } from '../user/dto/createUser.dto';
import { SignInDTO } from './dto/signIn.dto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signUp(createUserDto: CreateUserDTO): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.userService.findByEmail(createUserDto.email);
        if (user) throw new BadRequestException('User with such email already exists');

        const hashedPassword = await AuthService.hashData(createUserDto.password);
        const { id, email } = await this.userService.create({
            ...createUserDto,
            password: hashedPassword
        });

        const tokens = await this.getTokens(id, email);
        await this.updateRefreshToken(id, tokens.refreshToken);
        return tokens;
    }

    async signIn({ email, password }: SignInDTO): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.validateUser({ email, password });

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logOut(userId: string): Promise<void> {
      return this.updateRefreshToken(+userId, null);
    }

    async getTokens(userId: number, email: string): Promise<{ accessToken: string, refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
              expiresIn: '15m',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              email,
            },
            {
              secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
              expiresIn: '7d',
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = refreshToken !== null ? await AuthService.hashData(refreshToken) : null;
        await this.userService.updateRefreshToken(userId, hashedRefreshToken);
    }

    async refreshTokens(userId: number, refreshToken: string) {
      const user = await this.userService.findById(userId);
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access denied');
      const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatched)
        throw new ForbiddenException('Access denied');

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }

    public async validateUser({ email, password }: SignInDTO): Promise<User> {
        const user = await this.userService.getUserWithPassword(email);
    
        if (!user) {
          throw new BadRequestException('Invalid email');
        }
    
        const isMatched = await bcrypt.compare(password, user.password);
    
        if (!isMatched) {
          throw new BadRequestException('Passwords mismatch');
        }
        return user;
    }

    static async hashData(data: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedData = await bcrypt.hash(data, salt);
    
        return hashedData;
    }
}