import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { request } from 'http';
import { AuthenticatedRequest } from 'src/interfaces/authenticatedRequest.interface';
import { Operator } from 'src/operator/models/operator.model';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}
  async use(
    req: AuthenticatedRequest<Operator>,
    res: Response,
    next: NextFunction,
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const operatorSession =
      await this.authService.validateSessionAndGetOperator(accessToken);
    if (!operatorSession) throw new UnauthorizedException();
    req.principle = operatorSession.operator;
    next();
  }
}
