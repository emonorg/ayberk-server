import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
import { Operator } from 'src/operator/models/operator.model';
import {
  IPrivilege,
  Privilege,
  PrivilegeDomain,
} from 'src/operator/models/privilege.model';

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
        priPrivilege.domain === privilege.domain ||
        priPrivilege.domain === PrivilegeDomain.ALL
      ) {
        if (
          priPrivilege.actions[privilege.action] ||
          (priPrivilege.actions.manage &&
            priPrivilege.domain === PrivilegeDomain.ALL)
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
