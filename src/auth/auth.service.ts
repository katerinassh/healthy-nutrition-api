import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDTO } from '../user/dto/createCustomer.dto';
import { SignInDTO } from './dto/signIn.dto';
import { User } from '../user/user.entity';
import { JwtSignatureDTO } from './dto/jwtSignature.dto';
import { MailService } from '../mail/mail.service';
import { CompleteRegistrationDTO } from './dto/completeRegistration.dto';
import { DecodedToken } from './types/decodedToken.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async customerSignUp(
    createCustomerDto: CreateCustomerDTO,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userService.getByEmail(createCustomerDto.email);
    if (user)
      throw new BadRequestException('User with such email already exists');

    const hashedPassword = await AuthService.hashData(
      createCustomerDto.password,
    );
    const newUser = await this.userService.createCustomer({
      ...createCustomerDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return { ...tokens, user: newUser };
  }

  async signIn({
    email,
    password,
  }: SignInDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser({ email, password });

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logOut(userId: string): Promise<void> {
    return this.updateRefreshToken(+userId, null);
  }

  async getTokens(
    userId: number,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userJWTSignature = await this.getUserJWTSignature(userId);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userJWTSignature, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: process.env.JWT_ACCESS_LIFETIME,
      }),
      this.jwtService.signAsync(userJWTSignature, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: process.env.JWT_REFRESH_LIFETIME,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserJWTSignature(userId: number): Promise<JwtSignatureDTO> {
    const user = await this.userService.getById(userId);

    return {
      id: userId,
      email: user.email,
      role: user.role,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken =
      refreshToken !== null ? await AuthService.hashData(refreshToken) : null;
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access denied');
    const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatched) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async inviteAdmin(email: string) {
    const user = await this.userService.getByEmail(email);
    if (user)
      throw new BadRequestException(`User already registrated as ${user.role}`);

    const newUser = await this.userService.createBlankAdmin(email);
    const { accessToken } = await this.getTokens(newUser.id);
    try {
      await this.mailService.sendAdminInvite(newUser, accessToken);
    } catch (err) {
      await this.userService.delete(newUser.id);
      throw new NotAcceptableException(err);
    }
  }

  async completeRegistration(
    token: string,
    completeRegistrationDto: CompleteRegistrationDTO,
  ): Promise<User> {
    const decoded = this.jwtService.decode(token) as DecodedToken;
    if (Date.now() >= decoded.exp * 1000) {
      throw new ForbiddenException('Link has been expired');
    }

    const hashedPassword = await AuthService.hashData(
      completeRegistrationDto.password,
    );
    return this.userService.updateUser(decoded.id, {
      ...completeRegistrationDto,
      password: hashedPassword,
    });
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
