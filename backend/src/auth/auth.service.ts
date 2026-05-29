import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async register(email: string, password: string, name: string, tenantSlug: string, tenantName?: string) {
    let tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          slug: tenantSlug,
          name: tenantName || tenantSlug,
        }
      });

      const roles = [
        { name: 'ADMIN', permissions: ['*'] },
        { name: 'MANAGER', permissions: ['users:read', 'users:write', 'reports:read', 'dashboard:read'] },
        { name: 'EMPLOYEE', permissions: ['dashboard:read', 'tasks:read', 'tasks:write'] },
        { name: 'VIEWER', permissions: ['dashboard:read'] },
      ];

      for (const role of roles) {
        await prisma.role.create({
          data: {
            name: role.name,
            permissions: role.permissions,
            tenantId: tenant.id,
          },
        });
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: tenant.id
        }
      }
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe en esta empresa');
    }

    const adminRole = await prisma.role.findFirst({
      where: { tenantId: tenant.id, name: 'ADMIN' }
    });

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: adminRole!.id,
        tenantId: tenant.id,
      },
      include: { role: true }
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        tenantId: tenant.id, 
        tenantSlug: tenant.slug,
        role: user.role.name,
        permissions: user.role.permissions
      },
      'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
      },
      token
    };
  }

  async login(email: string, password: string, tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      throw new UnauthorizedException('Empresa no encontrada');
    }

    const user = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: tenant.id
        }
      },
      include: { role: true }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        tenantId: tenant.id, 
        tenantSlug: tenant.slug,
        role: user.role.name,
        permissions: user.role.permissions
      },
      'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
      },
      token
    };
  }
}
