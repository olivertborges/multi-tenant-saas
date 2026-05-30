import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales/pdf')
  async downloadPDF(@Query('start') start: string, @Query('end') end: string, @Res() res: Response, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.reportsService.generateSalesReport(tenantId, startDate, endDate, res);
  }

  @Get('sales/excel')
  async downloadExcel(@Query('start') start: string, @Query('end') end: string, @Res() res: Response, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.reportsService.generateExcelReport(tenantId, startDate, endDate, res);
  }
}
