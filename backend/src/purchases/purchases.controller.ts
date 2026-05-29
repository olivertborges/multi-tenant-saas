import { Controller, Get, Post, Put, Body, Param, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('my')
  async getMyPurchases(@Req() req: any) {
    const userId = req.user?.userId;
    return this.purchasesService.getMyPurchases(userId);
  }

  @Get()
  async getAll(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.purchasesService.getAllPurchases(tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.purchasesService.createPurchase(userId, tenantId, body);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.purchasesService.updateStatus(id, body.status);
  }
}
