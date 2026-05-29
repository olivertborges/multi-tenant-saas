import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { TenantModule } from './tenant/tenant.module';
import { ServicesModule } from './services/services.module';
import { AgendasModule } from './agendas/agendas.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { PointsModule } from './points/points.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [AuthModule, UsersModule, AdminModule, TenantModule, ServicesModule, AgendasModule, ProductsModule, CartModule, PointsModule, PurchasesModule],
})
export class AppModule {}
