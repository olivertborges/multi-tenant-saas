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
import { PaymentsModule } from './payments/payments.module';
import { EmailModule } from './email/email.module';
import { ReportsModule } from './reports/reports.module';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController, ...otros],
})

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AdminModule,
    TenantModule,
    ServicesModule,
    AgendasModule,
    ProductsModule,
    CartModule,
    PointsModule,
    PurchasesModule,
    PaymentsModule,
    EmailModule,
    ReportsModule,
  ],
})
export class AppModule {}
