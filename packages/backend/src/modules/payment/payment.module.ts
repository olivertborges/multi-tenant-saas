import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MercadoPagoProvider } from './providers/mercadopago.provider';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, MercadoPagoProvider, PrismaService, RedisService],
  exports: [PaymentService],
})
export class PaymentModule {}
