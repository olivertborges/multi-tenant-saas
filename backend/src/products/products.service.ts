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

  async getRelatedProducts(productId: string, tenantId: string) {
    const product = await this.findOne(productId, tenantId);
    if (!product) return [];

    return prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        id: { not: productId },
        OR: [
          { category: product.category },
          { price: { gte: product.price * 0.7, lte: product.price * 1.3 } }
        ]
      },
      take: 4,
      orderBy: { price: 'asc' }
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
        tenantId
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
        category: data.category
      }
    });
  }

  async delete(id: string, tenantId: string) {
    return prisma.product.delete({ where: { id } });
  }
}
