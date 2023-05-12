import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsString } from 'class-validator';

export class CompleteRegistrationDTO {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  password: string;
}
