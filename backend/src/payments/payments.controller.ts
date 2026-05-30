import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  async createPreference(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.paymentsService.createPreference(body.purchaseId, userId, tenantId);
  }
}
