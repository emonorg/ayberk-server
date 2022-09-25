import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { Operator, OperatorDocument } from './models/operator.model';
import { Action, PrivilegeDomain } from './models/privilege.model';
import { OperatorService } from './operator.service';

@Controller('operators')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get()
  async getOperators(): Promise<OperatorDocument[] | OperatorDocument> {
    return await this.operatorService.getOperators();
  }

  @Get('/:id')
  async getOperator(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<OperatorDocument[] | OperatorDocument> {
    return await this.operatorService.getOperators(id);
  }

  @Post()
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.CREATE,
  })
  async createOperator(
    @Body() dto: CreateOperatorDto,
  ): Promise<OperatorDocument> {
    return await this.operatorService.createOperator(dto);
  }
}
