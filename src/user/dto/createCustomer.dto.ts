import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateCustomerDTO {
  @ApiProperty({ description: 'User email', nullable: false, type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    nullable: false,
    type: 'string',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    nullable: false,
    type: 'string',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    nullable: false,
    type: 'string',
  })
  lastName: string;
}
