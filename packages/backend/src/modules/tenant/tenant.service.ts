import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async listTenants() {
    const cacheKey = 'tenants:list';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const tenants = await this.prisma.tenant.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await this.redis.set(cacheKey, JSON.stringify(tenants), 300);
    
    return tenants;
  }

  async getTenant(slug: string) {
    const cacheKey = `tenant:${slug}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug, deletedAt: null },
      include: {
        users: {
          where: { deletedAt: null },
          select: { id: true, email: true, name: true, role: true, isActive: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    await this.redis.set(cacheKey, JSON.stringify(tenant), 300);
    
    return tenant;
  }

  async createTenant(createTenantDto: CreateTenantDto) {
    const { slug, name, config } = createTenantDto;

    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      throw new ConflictException('El slug ya está en uso');
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        slug,
        name,
        config: config || {},
      },
    });

    await this.redis.del('tenants:list');

    return tenant;
  }

  async updateTenant(slug: string, updateTenantDto: UpdateTenantDto, user: any) {
    const tenant = await this.getTenant(slug);

    if (user.role !== 'SUPER_ADMIN' && user.tenantId !== tenant.id) {
      throw new ForbiddenException('No tienes permiso para modificar este tenant');
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { slug },
      data: updateTenantDto,
    });

    await this.redis.del(`tenant:${slug}`);
    await this.redis.del('tenants:list');

    return updatedTenant;
  }
}
