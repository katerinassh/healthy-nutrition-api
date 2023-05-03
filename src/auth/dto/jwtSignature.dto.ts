import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNumber, IsString } from 'class-validator';
import { RolesEnum } from '../../user/enum/roles.enum';

export class JwtSignatureDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  role?: RolesEnum;
}
