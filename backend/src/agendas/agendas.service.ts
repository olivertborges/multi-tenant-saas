import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AgendasService {
  async findAll(tenantId: string) {
    return prisma.agenda.findMany({
      where: { tenantId },
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true, duration: true, price: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findByUser(userId: string, tenantId: string) {
    return prisma.agenda.findMany({
      where: { userId, tenantId },
      include: { service: true },
      orderBy: { date: 'desc' }
    });
  }

  async create(data: any, userId: string, tenantId: string) {
    return prisma.agenda.create({
      data: {
        userId,
        serviceId: data.serviceId,
        tenantId,
        date: new Date(data.date),
        time: data.time,
        notes: data.notes || '',
        status: 'PENDING'
      },
      include: { service: true }
    });
  }

  async updateStatus(id: string, status: string, tenantId: string) {
    return prisma.agenda.update({
      where: { id },
      data: { status }
    });
  }

  async delete(id: string, tenantId: string) {
    return prisma.agenda.delete({ where: { id } });
  }
}
