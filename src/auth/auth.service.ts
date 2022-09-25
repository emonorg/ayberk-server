import * as Bcrypt from 'bcrypt';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(OperatorSession.name)
    private opSessionModel: Model<OperatorSessionDocument>,
    private operatorService: OperatorService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: OperatorSignInDto): Promise<IOperatorSession> {
    try {
      const operator = await this.operatorService.getOperatorByUsername(
        dto.username,
      );
      const isPasswordMatching = await Bcrypt.compare(
        dto.password,
        operator.encryptedPassword,
      );
      if (!isPasswordMatching) throw new UnauthorizedException();
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
        select: '-encryptedPassword', // TODO: Use exclude
        populate: { path: 'privileges' },
      })
      .exec();
    return session;
  }
}
