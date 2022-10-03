import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { GrantPrivilegeDto } from './dtos/grantPrivilege.dto';
import { Operator, OperatorDocument } from './models/operator.model';
import {
  Action,
  PrivilegeDocument,
  PrivilegeDomain,
} from '../privilege/models/privilege.model';
import { OperatorService } from './operator.service';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';

@Controller('operators')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get()
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.READ,
  })
  async getOperators(
    @Req() req: AuthenticatedRequest<Operator>,
  ): Promise<OperatorDocument[] | OperatorDocument> {
    return await this.operatorService.getOperators(req.principle);
  }

  @Get('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.READ,
  })
  async getOperator(
    @Req() req: AuthenticatedRequest<Operator>,
    @Param('id', MongoIdPipe) id: string,
  ): Promise<OperatorDocument[] | OperatorDocument> {
    return await this.operatorService.getOperators(req.principle, id);
  }

  @Post()
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.CREATE,
  })
  async createOperator(
    @Req() req: AuthenticatedRequest<Operator>,
    @Body() dto: CreateOperatorDto,
  ): Promise<OperatorDocument> {
    return await this.operatorService.createOperator(dto);
  }

  @Post('grant-privilege')
  @IsAuthorized({
    domain: PrivilegeDomain.PRIVILEGE,
    action: Action.CREATE,
  })
  async grantPrivilege(
    @Req() req: AuthenticatedRequest<Operator>,
    @Body() dto: GrantPrivilegeDto,
  ): Promise<PrivilegeDocument> {
    return await this.operatorService.grantPrivilege(dto);
  }
}
