import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.servicesService.findAll(tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.servicesService.create(body, tenantId);
  }
}
