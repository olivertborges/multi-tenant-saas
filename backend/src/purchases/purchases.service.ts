import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PurchasesService {
  async getMyPurchases(userId: string) {
    return prisma.purchase.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllPurchases(tenantId: string) {
    return prisma.purchase.findMany({
      where: { tenantId },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPurchase(userId: string, tenantId: string, data: any) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Carrito vacío');
    }

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const pointsEarned = Math.floor(total / 100); // 1 punto por cada 100 unidades

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        tenantId,
        total,
        paymentMethod: data.paymentMethod || 'CASH',
        pointsUsed: data.pointsUsed || 0,
        pointsEarned,
        status: 'PAID',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    // Actualizar stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // Vaciar carrito
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Agregar puntos al usuario
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: pointsEarned } }
    });

    await prisma.pointsLog.create({
      data: {
        userId,
        points: pointsEarned,
        type: 'EARNED',
        reason: `Compra #${purchase.id}`
      }
    });

    return purchase;
  }

  async updateStatus(id: string, status: string) {
    return prisma.purchase.update({
      where: { id },
      data: { status }
    });
  }
}
