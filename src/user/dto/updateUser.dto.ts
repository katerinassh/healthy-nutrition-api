import { IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  password: string;
}
