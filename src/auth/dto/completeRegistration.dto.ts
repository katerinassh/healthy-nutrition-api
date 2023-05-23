import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompleteRegistrationDTO {
  @ApiProperty({
    description: 'User first name',
    nullable: false,
    type: 'string',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    nullable: false,
    type: 'string',
  })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User email', nullable: false, type: 'string' })
  password: string;
}
