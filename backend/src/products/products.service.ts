import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async findAll(tenantId: string) {
    return prisma.product.findMany({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, tenantId: string) {
    return prisma.product.findFirst({
      where: { id, tenantId }
    });
  }

  async create(data: any, tenantId: string) {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category || '',
        images: data.images || [],
        tenantId,
        isActive: true
      }
    });
  }

  async update(id: string, data: any, tenantId: string) {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
        images: data.images,
        isActive: data.isActive
      }
    });
  }

  async delete(id: string, tenantId: string) {
    return prisma.product.delete({ where: { id } });
  }
}
