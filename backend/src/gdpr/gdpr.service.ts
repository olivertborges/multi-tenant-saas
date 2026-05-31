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

    // Estructurar los datos para exportar
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
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Anonimizar datos personales (GDPR: derecho al olvido)
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

    // Opcional: eliminar datos sensibles de otras tablas
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
    
    return {
      const preferences = user.preferences as any;
      marketingEmails: preferences?.marketingEmails || false,
      dataProcessing: true, // Por defecto aceptado
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
    
    return { message: 'Preferencias actualizadas', consent: user.preferences };
  }
}
