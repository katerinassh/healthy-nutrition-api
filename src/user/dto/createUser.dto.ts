import { IsEmail } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}
