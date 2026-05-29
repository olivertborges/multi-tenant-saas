import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tenants')
  async getAllTenants() {
    return this.adminService.getAllTenants();
  }

  @Get('tenants/:id/stats')
  async getTenantStats(@Param('id') id: string) {
    return this.adminService.getTenantStats(id);
  }
}
