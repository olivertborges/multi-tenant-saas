import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async findAll(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, tenantId: string) {
    const user = await prisma.user.findFirst({
      where: { id, tenantId },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Remover password por seguridad
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(data: any, tenantId: string, currentUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email: data.email,
          tenantId,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado en esta empresa');
    }

    const hashedPassword = await argon2.hash(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        roleId: data.roleId,
        tenantId,
        isActive: data.isActive !== false,
      },
      include: { role: true },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId);

    const updateData: any = {
      name: data.name,
      roleId: data.roleId,
      isActive: data.isActive,
    };

    if (data.password && data.password.length > 0) {
      updateData.password = await argon2.hash(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    await prisma.user.delete({ where: { id } });

    return { message: 'Usuario eliminado correctamente' };
  }

  async getRoles(tenantId: string) {
    return prisma.role.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }
}
