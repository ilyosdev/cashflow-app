import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { CreateClientRequest, UpdateClientRequest } from '@subscriptions/shared';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.clientsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(parseInt(id));
  }

  @Post()
  create(@Body() data: CreateClientRequest) {
    return this.clientsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateClientRequest) {
    return this.clientsService.update(parseInt(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientsService.delete(parseInt(id));
  }
}
