import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OperatorSignInDto } from './dtos/operatorSignIn.dto';
import { IOperatorSession } from './interfaces/operatorSession.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('operator/sign-in')
  async signIn(@Body() dto: OperatorSignInDto): Promise<IOperatorSession> {
    return await this.authService.signIn(dto);
  }
}
