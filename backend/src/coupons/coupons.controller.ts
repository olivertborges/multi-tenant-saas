import { Controller, Get, Post, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    const coupons = await this.couponsService.findAll(tenantId);
    return coupons || [];
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.couponsService.create(body, tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.couponsService.delete(id, tenantId);
  }
}
