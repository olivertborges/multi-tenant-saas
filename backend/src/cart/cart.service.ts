import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CartService {
  async getOrCreateCart(userId: string, tenantId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, tenantId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    }

    return cart;
  }

  async getCart(userId: string, tenantId: string) {
    return this.getOrCreateCart(userId, tenantId);
  }

  async addItem(userId: string, productId: string, quantity: number, tenantId: string) {
    const cart = await this.getOrCreateCart(userId, tenantId);

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } }
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity }
    });
  }

  async updateItem(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(cartItemId);
    }
    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  }

  async removeItem(cartItemId: string) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return { message: 'Carrito vaciado' };
  }
}
