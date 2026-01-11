import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreateExchangeRateRequest } from '@subscriptions/shared';

@Controller('exchange-rates')
@UseGuards(JwtAuthGuard)
export class ExchangeRatesController {
  constructor(private exchangeRatesService: ExchangeRatesService) {}

  @Get()
  findAll() {
    return this.exchangeRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRatesService.findOne(parseInt(id));
  }

  @Get('latest')
  getLatestRate(@Query('from') from: string, @Query('to') to: string) {
    return this.exchangeRatesService.getLatestRate(from, to);
  }

  @Post()
  create(@Body() data: CreateExchangeRateRequest) {
    return this.exchangeRatesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateExchangeRateRequest>) {
    return this.exchangeRatesService.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.exchangeRatesService.delete(parseInt(id));
  }
}
