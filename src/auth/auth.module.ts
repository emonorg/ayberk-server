import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OperatorModule } from 'src/operator/operator.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OperatorSession,
  OperatorSessionSchema,
} from './models/operatorSession.model';

@Module({
  imports: [
    OperatorModule,
    MongooseModule.forFeature([
      {
        schema: OperatorSessionSchema,
        name: OperatorSession.name,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          'service.operator_session_secret_key',
        ),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
