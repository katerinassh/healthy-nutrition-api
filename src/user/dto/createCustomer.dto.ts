import { IsEmail } from 'class-validator';

export class CreateCustomerDTO {
  @IsEmail()
  email: string;

  password: string;

  firstName: string;

  lastName: string;
}
