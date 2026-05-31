import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GDPRService {
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        purchases: {
          include: { items: { include: { product: true } } }
        },
        reviews: true,
        pointsLog: true,
        agendas: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const userData = {
      personal: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        points: user.points,
        membershipLevel: user.membershipLevel,
      },
      purchases: user.purchases.map(p => ({
        id: p.id,
        total: p.total,
        status: p.status,
        createdAt: p.createdAt,
        items: p.items.map(i => ({
          product: i.product.name,
          quantity: i.quantity,
          price: i.price,
        })),
      })),
      reviews: user.reviews,
      pointsHistory: user.pointsLog,
      appointments: user.agendas,
    };

    return userData;
  }

  async deleteUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@deleted.com`,
        name: 'Usuario Eliminado',
        phone: null,
        avatar: null,
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await prisma.session.deleteMany({
      where: { userId },
    });

    return { message: 'Tus datos han sido eliminados correctamente' };
  }

  async getUserConsent(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        preferences: true,
      },
    });
    
    const preferences = user?.preferences as any || {};
    
    return {
      marketingEmails: preferences.marketingEmails || false,
      dataProcessing: true,
      lastUpdated: new Date(),
    };
  }

  async updateUserConsent(userId: string, consent: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          marketingEmails: consent.marketingEmails,
          dataProcessing: consent.dataProcessing,
          consentUpdatedAt: new Date(),
        },
      },
    });
    
    const preferences = user.preferences as any;
    
    return { message: 'Preferencias actualizadas', consent: preferences };
  }
}
