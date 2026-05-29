import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/database/prisma.service';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, tenantSlug: string, ipAddress?: string, userAgent?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug, status: 'ACTIVE' }
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant no válido');
    }

    const user = await this.prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId: tenant.id } }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const tokens = await this.generateTokens(user.id, tenant.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async register(email: string, password: string, name: string, tenantSlug: string) {
    let tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: {
          slug: tenantSlug,
          name: tenantSlug,
          config: {}
        }
      });
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId: tenant.id } }
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    const hashedPassword = await hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        tenantId: tenant.id,
        role: 'TENANT_ADMIN'
      }
    });

    const tokens = await this.generateTokens(user.id, tenant.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  private async generateTokens(userId: string, tenantId: string) {
    const payload = { sub: userId, tenantId };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' })
    ]);

    return { accessToken, refreshToken };
  }
}
