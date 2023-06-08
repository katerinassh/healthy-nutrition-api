import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'New first name',
    nullable: true,
    type: 'string',
  })
  firstName?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'New last name',
    nullable: true,
    type: 'string',
  })
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'New password',
    nullable: true,
    type: 'string',
  })
  password?: string;
}
