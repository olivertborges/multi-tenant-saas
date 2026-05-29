import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ServicesService {
  async findAll(tenantId: string) {
    if (!tenantId) return [];
    return prisma.service.findMany({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: any, tenantId: string) {
    if (!tenantId) {
      throw new Error('Tenant ID requerido');
    }
    return prisma.service.create({
      data: {
        name: data.name,
        description: data.description || '',
        duration: Number(data.duration),
        price: Number(data.price),
        category: data.category || '',
        tenantId: tenantId,
        isActive: true
      }
    });
  }
}
