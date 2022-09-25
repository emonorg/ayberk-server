import { SetMetadata } from '@nestjs/common';
import { IPrivilege } from 'src/operator/models/privilege.model';

export const IsAuthorized = (privilege: IPrivilege) =>
  SetMetadata('privilege', privilege);
