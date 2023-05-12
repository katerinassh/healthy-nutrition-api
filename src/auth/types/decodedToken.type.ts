import { RolesEnum } from '../../user/enum/roles.enum';

export type DecodedToken = {
  id: number;
  email: string;
  role: RolesEnum;
  iat: number;
  exp: number;
};
