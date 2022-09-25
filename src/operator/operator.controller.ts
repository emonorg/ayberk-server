import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from 'src/validators/pipes/mongoId.pipe';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { OperatorDocument } from './models/operator.model';
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
  async createOperator(
    @Body() dto: CreateOperatorDto,
  ): Promise<OperatorDocument> {
    return await this.operatorService.createOperator(dto);
  }
}
