import { Privilege } from 'src/privilege/models/privilege.model';

export interface IOperatorToken {
  operatorId: string;
  privileges: Privilege[];
}
