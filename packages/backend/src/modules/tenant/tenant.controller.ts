import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/user.decorator';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  async listTenants() {
    return this.tenantService.listTenants();
  }

  @Get(':slug')
  async getTenant(@Param('slug') slug: string) {
    return this.tenantService.getTenant(slug);
  }

  @Post()
  @Roles('SUPER_ADMIN')
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto);
  }

  @Put(':slug')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  async updateTenant(
    @Param('slug') slug: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() user: any,
  ) {
    return this.tenantService.updateTenant(slug, updateTenantDto, user);
  }
}
