import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

@Injectable()
export class PaymentsService {
  private accessToken: string;

  constructor() {
    this.accessToken = 'APP_USR-6475548712758112-102400-9d6c5a293435a5c5092131c9c2c3ac1d-512835935';
  }

  async createPreference(purchaseId: string, userId: string, tenantId: string) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { items: { include: { product: true } }, user: true }
    });

    if (!purchase) throw new Error('Compra no encontrada');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const data = {
      items: purchase.items.map(item => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: 'ARS'
      })),
      payer: {
        email: purchase.user.email
      },
      back_urls: {
        success: `${frontendUrl}/purchases`,
        failure: `${frontendUrl}/cart`,
        pending: `${frontendUrl}/cart`
      },
      external_reference: purchaseId
    };

    try {
      const response = await axios.post('https://api.mercadopago.com/checkout/preferences', data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error Mercado Pago:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al crear preferencia');
    }
  }
}
