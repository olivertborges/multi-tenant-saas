import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PointsService {
  async getUserPoints(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true }
    });
    return user?.points || 0;
  }

  async addPoints(userId: string, points: number, reason: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: points }
      }
    });

    await prisma.pointsLog.create({
      data: {
        userId,
        points,
        type: 'EARNED',
        reason
      }
    });

    return user.points;
  }

  async usePoints(userId: string, points: number, reason: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if ((user?.points || 0) < points) {
      throw new Error('Puntos insuficientes');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        points: { decrement: points }
      }
    });

    await prisma.pointsLog.create({
      data: {
        userId,
        points: -points,
        type: 'SPENT',
        reason
      }
    });

    return updated.points;
  }

  async getPointsHistory(userId: string) {
    return prisma.pointsLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
