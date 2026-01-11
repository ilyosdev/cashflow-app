import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreatePaymentRequest } from '@subscriptions/shared';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  findAll(@Query('clientId') clientId?: string, @Query('search') search?: string) {
    return this.paymentsService.findAll(
      clientId ? parseInt(clientId) : undefined,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(parseInt(id));
  }

  @Post()
  create(@Body() data: CreatePaymentRequest) {
    return this.paymentsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreatePaymentRequest>) {
    return this.paymentsService.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paymentsService.delete(parseInt(id));
  }
}
