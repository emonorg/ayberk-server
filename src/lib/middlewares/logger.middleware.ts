import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusMessage, statusCode } = response;

      this.logger.log(
        `[${statusCode} ${statusMessage}] ${method} ${url} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
