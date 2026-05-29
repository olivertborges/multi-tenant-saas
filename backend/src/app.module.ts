import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [AuthModule, UsersModule, AdminModule, TenantModule],
})
export class AppModule {}
