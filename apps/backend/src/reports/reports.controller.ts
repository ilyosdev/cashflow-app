import { Controller, Get, Query, UseGuards, Res, Header, StreamableFile } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getDateRange } from '@subscriptions/shared';
import type { Response } from 'express';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private reportsService: ReportsService,
    private exportService: ExportService,
  ) {}

  @Get('revenue')
  async getRevenueReport(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
  ) {
    const dateRange = getDateRange(range);
    return this.reportsService.getRevenueReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
    );
  }

  @Get('revenue/export/csv')
  @Header('Content-Type', 'text/csv')
  async exportRevenueCSV(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Res() res: Response,
  ) {
    const dateRange = getDateRange(range);
    const report = await this.reportsService.getRevenueReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
    );

    const csvBuffer = this.exportService.exportToCSV(
      report.payments,
      `revenue-report-${range}.csv`,
    );

    res.setHeader('Content-Disposition', `attachment; filename="revenue-report-${range}.csv"`);
    return new StreamableFile(csvBuffer);
  }

  @Get('revenue/export/pdf')
  @Header('Content-Type', 'application/pdf')
  async exportRevenuePDF(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Res() res: Response,
  ) {
    const dateRange = getDateRange(range);
    const report = await this.reportsService.getRevenueReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
    );

    const pdfBuffer = this.exportService.exportRevenueToPDF(
      report.payments,
      report.total,
      dateRange,
    );

    res.setHeader('Content-Disposition', `attachment; filename="revenue-report-${range}.pdf"`);
    return new StreamableFile(pdfBuffer);
  }

  @Get('expenses')
  async getExpenseReport(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Query('type') type?: string,
  ) {
    const dateRange = getDateRange(range);
    return this.reportsService.getExpenseReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
      type,
    );
  }

  @Get('expenses/export/csv')
  @Header('Content-Type', 'text/csv')
  async exportExpensesCSV(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Query('type') type?: string,
    @Res() res: Response,
  ) {
    const dateRange = getDateRange(range);
    const report = await this.reportsService.getExpenseReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
      type,
    );

    const csvBuffer = this.exportService.exportToCSV(
      report.expenses,
      `expenses-report-${range}.csv`,
    );

    res.setHeader('Content-Disposition', `attachment; filename="expenses-report-${range}.csv"`);
    return new StreamableFile(csvBuffer);
  }

  @Get('expenses/export/pdf')
  @Header('Content-Type', 'application/pdf')
  async exportExpensesPDF(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Query('type') type?: string,
    @Res() res: Response,
  ) {
    const dateRange = getDateRange(range);
    const report = await this.reportsService.getExpenseReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
      type,
    );

    const pdfBuffer = this.exportService.exportExpensesToPDF(
      report.expenses,
      report.total,
      dateRange,
    );

    res.setHeader('Content-Disposition', `attachment; filename="expenses-report-${range}.pdf"`);
    return new StreamableFile(pdfBuffer);
  }

  @Get('cash-flow')
  async getCashFlowReport(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
  ) {
    const dateRange = getDateRange(range);
    return this.reportsService.getCashFlowReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
    );
  }

  @Get('cash-flow/export/pdf')
  @Header('Content-Type', 'application/pdf')
  async exportCashFlowPDF(
    @Query('range') range: string = 'this_month',
    @Query('currency') currency?: string,
    @Res() res: Response,
  ) {
    const dateRange = getDateRange(range);
    const report = await this.reportsService.getCashFlowReport(
      dateRange.startDate,
      dateRange.endDate,
      currency,
    );

    const pdfBuffer = this.exportService.exportCashFlowToPDF(
      report.revenue,
      report.expenses,
      report.net,
      dateRange,
    );

    res.setHeader('Content-Disposition', `attachment; filename="cash-flow-report-${range}.pdf"`);
    return new StreamableFile(pdfBuffer);
  }
}
