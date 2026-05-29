import { Injectable, NestMiddleware, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Excluir rutas públicas que no necesitan tenant
    const publicPaths = ['/health', '/auth/login', '/auth/register'];
    if (publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const tenantSlug = req.headers['x-tenant-id'] as string || 
                       req.params.tenantSlug ||
                       req.body.tenantSlug;

    if (!tenantSlug && !req.headers['authorization']) {
      return next();
    }

    if (!tenantSlug) {
      throw new BadRequestException('Se requiere identificar el tenant (x-tenant-id)');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug, status: 'ACTIVE' },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado o inactivo');
    }

    req.tenant = tenant;
    next();
  }
}
