import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TenantService {
  async getTheme(tenantSlug: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { theme: true, name: true, logo: true }
    });
    
    if (!tenant) {
      return { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4', font: 'Inter' };
    }
    
    // Si el tema está guardado como string, parsearlo
    if (typeof tenant.theme === 'string') {
      return JSON.parse(tenant.theme);
    }
    
    return tenant.theme || { primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4', font: 'Inter' };
  }

  async updateTheme(tenantSlug: string, theme: any) {
    return prisma.tenant.update({
      where: { slug: tenantSlug },
      data: { theme: JSON.stringify(theme) }
    });
  }
}
