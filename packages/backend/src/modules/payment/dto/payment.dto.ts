import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  planId: string;

  @IsOptional()
  @IsIn(['mercadopago', 'stripe'])
  provider?: string;
}

export class ProcessPaymentDto {
  @IsString()
  subscriptionId: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  paymentMethod: string;
}
