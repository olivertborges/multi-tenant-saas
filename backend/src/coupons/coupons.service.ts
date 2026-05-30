import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CouponsService {
  async findAll(tenantId: string) {
    return prisma.coupon.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: any, tenantId: string) {
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        minPurchase: data.minPurchase ? parseFloat(data.minPurchase) : null,
        maxDiscount: data.maxDiscount ? parseFloat(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        tenantId
      }
    });
  }

  async delete(id: string, tenantId: string) {
    return prisma.coupon.deleteMany({
      where: { id, tenantId }
    });
  }
}
