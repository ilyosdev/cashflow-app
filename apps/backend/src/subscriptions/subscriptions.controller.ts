import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreateSubscriptionRequest } from '@subscriptions/shared';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get()
  findAll(@Query('clientId') clientId?: string) {
    return this.subscriptionsService.findAll(clientId ? parseInt(clientId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(parseInt(id));
  }

  @Post()
  create(@Body() data: CreateSubscriptionRequest) {
    return this.subscriptionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateSubscriptionRequest>) {
    return this.subscriptionsService.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subscriptionsService.delete(parseInt(id));
  }
}
