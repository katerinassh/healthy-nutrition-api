import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { RolesEnum } from '../../user/enum/roles.enum';

export class JwtSignatureDTO {
  @ApiProperty({ description: 'User id', nullable: false, type: 'number' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'User email', nullable: false, type: 'string' })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: 'User role - admin/customer',
    nullable: true,
    enum: RolesEnum,
  })
  @ApiProperty()
  role?: RolesEnum;
}
