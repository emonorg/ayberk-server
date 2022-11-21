import { createHmac } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OperatorService } from 'src/operator/operator.service';
import { OperatorSignInDto } from './dtos/operatorSignIn.dto';
import { IOperatorSession } from './interfaces/operatorSession.interface';
import { OperatorDocument } from 'src/operator/models/operator.model';
import { IOperatorToken } from './interfaces/operatorToken.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  OperatorSession,
  OperatorSessionDocument,
} from './models/operatorSession.model';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(OperatorSession.name)
    private opSessionModel: Model<OperatorSessionDocument>,
    private operatorService: OperatorService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(dto: OperatorSignInDto): Promise<IOperatorSession> {
    try {
      const operator =
        await this.operatorService.internal_getOperatorByUsername(dto.username);
      const passwordHash = await createHmac(
        'sha256',
        this.configService.get('encryption.secret'),
      )
        .update(dto.password)
        .digest('hex');
      if (passwordHash !== operator.passwordHash)
        throw new UnauthorizedException();
      return await this.createOperatorSession(operator);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async createOperatorSession(
    operator: OperatorDocument,
  ): Promise<IOperatorSession> {
    const operatorToken: IOperatorToken = {
      operatorId: operator.id,
      privileges: operator.privileges,
    };
    const token = await this.jwtService.sign(operatorToken);

    const res = await this.opSessionModel.findOneAndUpdate(
      { operator },
      {
        accessToken: token,
        operator,
      },
    );
    if (!res)
      this.opSessionModel.create({
        accessToken: token,
        operator,
      });

    return { accessToken: token, ttl: 3600 };
  }

  async validateSessionAndGetOperator(
    accessToken: string,
  ): Promise<OperatorSessionDocument> {
    const session = await this.opSessionModel
      .findOne({ accessToken: accessToken })
      .populate({
        path: 'operator',
        select: '-passwordHash', // TODO: Use exclude
        populate: { path: 'privileges' },
      })
      .exec();
    return session;
  }
}
