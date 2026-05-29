import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto } from './dto/user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/user.decorator';
import { CurrentTenant } from '../../../shared/decorators/tenant.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER')
  async listUsers(
    @CurrentTenant() tenant: any,
    @Query() query: ListUsersQueryDto,
  ) {
    return this.userService.listUsers(tenant.id, query);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER')
  async getUser(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.userService.getUser(tenant.id, id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  async createUser(
    @CurrentTenant() tenant: any,
    @CurrentUser() currentUser: any,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.createUser(tenant.id, currentUser.id, createUserDto);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  async updateUser(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(tenant.id, id, updateUserDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'TENANT_ADMIN')
  async deleteUser(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.userService.deleteUser(tenant.id, id);
  }
}
