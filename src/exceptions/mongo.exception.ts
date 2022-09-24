import { MongoError } from 'mongodb';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    switch (exception.code) {
      case 11000:
        const errorField = exception.errmsg.substring(
          exception.errmsg.indexOf('{') + 2,
          exception.errmsg.lastIndexOf('}') - 1,
        );
        response.status(400).json({
          error: {
            statusCode: 400,
            message: 'Duplicated data!',
            error: errorField,
          },
        });
    }
  }
}

@Catch(mongoose.Error.CastError)
export class MongoCastExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    response.status(400).json({
      error: {
        statusCode: 400,
        message: 'Invalid input!',
        error: exception.path,
      },
    });
  }
}
