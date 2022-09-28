import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { Action, PrivilegeDomain } from 'src/operator/models/privilege.model';
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
    @Param('projectId', MongoIdPipe) projectId: string,
    @Param('key') key: string,
  ): Promise<VariableValueType> {
    return await this.variableService.getVariableValueByKey(projectId, key);
  }

  @Get('/:projectId')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.READ,
  })
  async getProjectVariables(
    @Param('projectId', MongoIdPipe) projectId: string,
  ): Promise<VariableValueType> {
    return await this.variableService.getProjectVariables(projectId);
  }

  @Post('')
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
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchVariableByIdDto,
  ): Promise<VariableDocument> {
    return await this.variableService.patchVariableById(id, dto);
  }

  @Post('update')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.UPDATE,
  })
  async updateVariableByKey(
    @Body() dto: UpdateVariableByKeyDto,
  ): Promise<VariableValueType> {
    return await this.variableService.updateVariableByKey(dto);
  }

  @Delete('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.VARIABLES,
    action: Action.DELETE,
  })
  async deleteVariable(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<VariableValueType> {
    return await this.variableService.deleteVariableById(id);
  }
}
