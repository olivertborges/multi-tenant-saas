import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReviewsService {
  async getProductReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAverageRating(productId: string) {
    const reviews = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true
    });
    return {
      average: reviews._avg.rating || 0,
      total: reviews._count
    };
  }

  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existing) {
      return prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment, updatedAt: new Date() }
      });
    }

    // Verificar si el usuario compró el producto
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        status: 'PAID',
        items: { some: { productId } }
      }
    });

    return prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        productId,
        isVerified: !!purchase
      },
      include: { user: { select: { name: true } } }
    });
  }

  async deleteReview(reviewId: string, userId: string) {
    return prisma.review.delete({
      where: { id: reviewId, userId }
    });
  }
}
