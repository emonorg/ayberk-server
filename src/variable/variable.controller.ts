import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { Operator } from 'src/operator/models/operator.model';
import { Action, PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { CreateVariableDto } from './dtos/createVariable.dto';
import { PatchVariableByIdDto } from './dtos/patchVariableById.dto';
import { UpdateVariableByKeyDto } from './dtos/updateVariable.dto';
import { VariableDocument, VariableValueType } from './models/variable.model';
import { VariableService } from './variable.service';

@Controller('variables')
export class VariableController {
  constructor(private variableService: VariableService) {}

  @Get('/:projectId/:key')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.READ,
  })
  async getVariableByKey(
    @Req() req: AuthenticatedRequest<Operator>,
    @Param('projectId', MongoIdPipe) projectId: string,
    @Param('key') key: string,
  ): Promise<VariableValueType> {
    return await this.variableService.getVariableValueByKey(
      req.principle,
      projectId,
      key,
    );
  }

  @Get('/:projectId')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.READ,
  })
  async getProjectVariables(
    @Req() req: AuthenticatedRequest<Operator>,
    @Param('projectId', MongoIdPipe) projectId: string,
  ): Promise<VariableValueType> {
    return await this.variableService.getProjectVariables(
      req.principle,
      projectId,
    );
  }

  @Post()
  @IsAuthorized({ domain: PrivilegeDomain.VARIABLES, action: Action.READ })
  async createVariable(@Body() dto: CreateVariableDto) {
    return await this.variableService.createVariable(dto);
  }

  @Patch('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.UPDATE,
  })
  async patchProject(
    @Req() req: AuthenticatedRequest<Operator>,
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchVariableByIdDto,
  ): Promise<VariableDocument> {
    return await this.variableService.patchVariableById(req.principle, id, dto);
  }

  @Post('update')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.UPDATE,
  })
  async updateVariableByKey(
    @Req() req: AuthenticatedRequest<Operator>,
    @Body() dto: UpdateVariableByKeyDto,
  ): Promise<VariableValueType> {
    return await this.variableService.updateVariableByKey(req.principle, dto);
  }

  @Delete('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.DELETE,
  })
  async deleteVariable(
    @Req() req: AuthenticatedRequest<Operator>,
    @Param('id', MongoIdPipe) id: string,
  ): Promise<VariableValueType> {
    return await this.variableService.deleteVariableById(req.principle, id);
  }
}
