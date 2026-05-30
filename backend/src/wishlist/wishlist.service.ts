import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class WishlistService {
  async getWishlist(userId: string) {
    try {
      const items = await prisma.wishlist.findMany({
        where: { userId },
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      });
      return items || [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  }

  async addToWishlist(userId: string, productId: string) {
    try {
      const existing = await prisma.wishlist.findUnique({
        where: { userId_productId: { userId, productId } }
      });

      if (existing) {
        return existing;
      }

      return await prisma.wishlist.create({
        data: { userId, productId },
        include: { product: true }
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string) {
    try {
      return await prisma.wishlist.delete({
        where: { userId_productId: { userId, productId } }
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  async isInWishlist(userId: string, productId: string) {
    try {
      const item = await prisma.wishlist.findUnique({
        where: { userId_productId: { userId, productId } }
      });
      return !!item;
    } catch (error) {
      return false;
    }
  }
}
