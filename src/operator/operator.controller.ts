import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { GrantPrivilegeDto } from './dtos/grantPrivilege.dto';
import { OperatorDocument } from './models/operator.model';
import {
  Action,
  PrivilegeDocument,
  PrivilegeDomain,
} from './models/privilege.model';
import { OperatorService } from './operator.service';

@Controller('operators')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @Get()
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.READ,
  })
  async getOperators(): Promise<OperatorDocument[] | OperatorDocument> {
    return await this.operatorService.getOperators();
  }

  @Get('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.OPERATORS,
    action: Action.READ,
  })
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

  @Post('grant-privilege')
  @IsAuthorized({
    domain: PrivilegeDomain.PRIVILEGE,
    action: Action.CREATE,
  })
  async grantPrivilege(
    @Body() dto: GrantPrivilegeDto,
  ): Promise<PrivilegeDocument> {
    return await this.operatorService.grantPrivilege(dto);
  }
}
