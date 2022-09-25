import { Privilege } from 'src/operator/models/privilege.model';

export interface IOperatorToken {
  operatorId: string;
  privileges: Privilege[];
}
