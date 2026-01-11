import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreateExpenseRequest } from '@subscriptions/shared';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('type') type?: string) {
    return this.expensesService.findAll(search, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(parseInt(id));
  }

  @Post()
  create(@Body() data: CreateExpenseRequest) {
    return this.expensesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateExpenseRequest>) {
    return this.expensesService.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.expensesService.delete(parseInt(id));
  }
}
