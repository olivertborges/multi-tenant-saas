import { Controller, Get, Post, Put, Delete, Body, Param, Headers, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.usersService.findAll(tenantId);
  }

  @Get('roles')
  async getRoles(@Headers('x-tenant-id') tenantId: string) {
    return this.usersService.getRoles(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    return this.usersService.findOne(id, tenantId);
  }

  @Post()
  async create(@Body() body: any, @Headers('x-tenant-id') tenantId: string, @Req() req: any) {
    const currentUserId = req.user?.userId;
    return this.usersService.create(body, tenantId, currentUserId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Headers('x-tenant-id') tenantId: string) {
    return this.usersService.update(id, body, tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    return this.usersService.delete(id, tenantId);
  }
}
