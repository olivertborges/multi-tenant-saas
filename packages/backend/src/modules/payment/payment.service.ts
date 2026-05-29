import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { MercadoPagoProvider } from './providers/mercadopago.provider';
import { CreateSubscriptionDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private mercadopago: MercadoPagoProvider,
  ) {}

  async createSubscription(tenantId: string, dto: CreateSubscriptionDto) {
    const { planId, provider = 'mercadopago' } = dto;

    const plan = await this.prisma.plan.findFirst({
      where: { id: planId, tenantId, isActive: true },
    });

    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    let providerResult;
    if (provider === 'mercadopago') {
      providerResult = await this.mercadopago.createSubscription({
        tenantId,
        planId: plan.id,
        amount: plan.price,
        interval: plan.interval,
        email: `tenant-${tenantId}@example.com`,
      });
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        tenantId,
        planId: plan.id,
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(Date.now() + (plan.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000),
        provider,
        providerId: providerResult.providerId,
      },
    });

    return {
      subscription,
      checkoutUrl: providerResult.checkoutUrl,
      provider,
    };
  }

  async listSubscriptions(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) where.status = status;

    return this.prisma.subscription.findMany({
      where,
      include: { plan: true, invoices: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelSubscription(tenantId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    if (subscription.provider === 'mercadopago') {
      await this.mercadopago.cancelSubscription(subscription.providerId);
    }

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'cancelled' },
    });

    return { message: 'Suscripción cancelada correctamente' };
  }

  async listInvoices(tenantId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { tenantId },
        include: { subscription: { include: { plan: true } }, payments: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where: { tenantId } }),
    ]);

    return {
      data: invoices,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async handleWebhook(provider: string, payload: any) {
    if (provider === 'mercadopago') {
      await this.mercadopago.handleWebhook(payload);
    }
    return { received: true };
  }
}
