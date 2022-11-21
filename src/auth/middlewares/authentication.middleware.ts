import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
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
    try {
      const accessToken = req.headers.authorization.split(' ')[1];
      const operatorSession =
        await this.authService.validateSessionAndGetOperator(accessToken);
      if (!operatorSession)
        return res.status(401).json(new UnauthorizedException()['response']);
      req.principle = operatorSession.operator;
      next();
    } catch (e) {
      if (e instanceof TypeError)
        return res.status(401).send(new UnauthorizedException()['response']);
    }
  }
}
