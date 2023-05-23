import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDTO {
  @ApiProperty({ description: 'User email', nullable: false, type: 'string' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User email', nullable: false, type: 'string' })
  @IsNotEmpty()
  password: string;
}
