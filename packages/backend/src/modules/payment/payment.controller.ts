import { Controller, Post, Get, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto, ProcessPaymentDto } from './dto/payment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentTenant } from '../../../shared/decorators/tenant.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('subscriptions')
  @Roles('TENANT_ADMIN')
  async createSubscription(
    @CurrentTenant() tenant: any,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.paymentService.createSubscription(tenant.id, createSubscriptionDto);
  }

  @Get('subscriptions')
  @Roles('TENANT_ADMIN')
  async listSubscriptions(
    @CurrentTenant() tenant: any,
    @Query('status') status?: string,
  ) {
    return this.paymentService.listSubscriptions(tenant.id, status);
  }

  @Post('subscriptions/:id/cancel')
  @Roles('TENANT_ADMIN')
  async cancelSubscription(
    @CurrentTenant() tenant: any,
    @Param('id') subscriptionId: string,
  ) {
    return this.paymentService.cancelSubscription(tenant.id, subscriptionId);
  }

  @Get('invoices')
  @Roles('TENANT_ADMIN')
  async listInvoices(
    @CurrentTenant() tenant: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentService.listInvoices(tenant.id, page, limit);
  }

  @Post('webhooks/mercadopago')
  async mercadopagoWebhook(@Req() request: any) {
    const signature = request.headers['x-signature'];
    const body = request.body;
    return this.paymentService.handleWebhook('mercadopago', { signature, body });
  }
}
