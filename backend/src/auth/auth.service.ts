import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async register(email: string, password: string, name: string, tenantSlug: string, tenantName?: string) {
    // Buscar o crear el tenant
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
    }

    // Verificar si el usuario ya existe en este tenant
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

    // Crear el usuario
    const hashedPassword = await argon2.hash(password);
    const role = 'ADMIN'; // El primer usuario es ADMIN

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        tenantId: tenant.id,
      }
    });

    // Generar token incluyendo tenant
    const token = jwt.sign(
      { userId: user.id, email: user.email, tenantId: tenant.id, tenantSlug: tenant.slug },
      'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
      },
      token
    };
  }

  async login(email: string, password: string, tenantSlug?: string) {
    // Buscar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      throw new UnauthorizedException('Empresa no encontrada');
    }

    // Buscar usuario en ese tenant
    const user = await prisma.user.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: tenant.id
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, tenantId: tenant.id, tenantSlug: tenant.slug },
      'secret-key',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        tenantName: tenant.name,
      },
      token
    };
  }
}
