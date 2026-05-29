import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':slug/theme')
  async getTheme(@Param('slug') slug: string) {
    return this.tenantService.getTheme(slug);
  }

  @Put(':slug/theme')
  async updateTheme(@Param('slug') slug: string, @Body() theme: any) {
    return this.tenantService.updateTheme(slug, theme);
  }
}
