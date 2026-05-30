import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WishlistService {
  async getWishlist(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addToWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      return existing;
    }

    return prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true }
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } }
    });
  }

  async isInWishlist(userId: string, productId: string) {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    return !!item;
  }
}
