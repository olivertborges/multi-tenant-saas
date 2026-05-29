import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AdminService {
  async getAllTenants() {
    return prisma.tenant.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTenantStats(tenantId: string) {
    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: { tenantId },
        select: { id: true, name: true, email: true, role: true, isActive: true }
      }),
      prisma.user.count({ where: { tenantId } })
    ]);

    return { users, totalUsers };
  }
}
