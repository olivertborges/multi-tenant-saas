import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { PaymentModule } from './modules/payment/payment.module';
import { HealthController } from './health/health.controller';
import { TenantMiddleware } from './shared/middleware/tenant.middleware';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

@Module({
  imports: [AuthModule, UserModule, TenantModule, PaymentModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
