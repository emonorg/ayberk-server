import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
import { Operator } from 'src/operator/models/operator.model';
import {
  IPrivilege,
  Privilege,
  PrivilegeDomain,
} from 'src/privilege/models/privilege.model';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const privilege = this.reflector.get<IPrivilege>(
      'privilege',
      context.getHandler(),
    );
    if (!privilege) {
      return true;
    }
    const request: AuthenticatedRequest<Operator> = context
      .switchToHttp()
      .getRequest();
    const principle = request.principle;
    return this.matchPrivileges(privilege, principle.privileges);
  }

  matchPrivileges(
    privilege: IPrivilege,
    PrinciplePrivileges: Privilege[],
  ): boolean {
    for (const priPrivilege of PrinciplePrivileges) {
      if (
        priPrivilege.domain === PrivilegeDomain.ALL &&
        priPrivilege.actions.manage
      )
        return true;

      if (
        priPrivilege.domain === privilege.domain &&
        priPrivilege.actions[privilege.action]
      ) {
        return true;
      }
    }
    return false;
  }
}
