import { authTests } from './auth';
import { operatorTests } from './operator';
import { privilegeTests } from './privilege';

describe('sequentially run tests', () => {
  authTests();
  operatorTests();
  privilegeTests();
});
