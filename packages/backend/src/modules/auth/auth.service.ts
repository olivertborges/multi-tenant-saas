import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/database/prisma.service';
import { hash, verify } from 'argon2';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, tenantSlug: string, ipAddress?: string, userAgent?: string) {
    // Buscar tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug, status: 'ACTIVE' }
    });

    if (!tenant) {
      throw new UnauthorizedException('Tenant no válido');
    }

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId: tenant.id } }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar password
    const isValid = await verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generar tokens
    const tokens = await this.generateTokens(user.id, tenant.id);
    
    // Crear sesión
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: uuidv4(),
        refreshToken: tokens.refreshToken,
        ipAddress,
        deviceInfo: userAgent ? { userAgent } : {},
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }

  async register(email: string, password: string, name: string, tenantSlug: string) {
    // Crear o obtener tenant
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

    // Verificar si usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId: tenant.id } }
    });

    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hash password
    const hashedPassword = await hash(password);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        tenantId: tenant.id,
        role: tenant.users.length === 0 ? 'TENANT_ADMIN' : 'EMPLOYEE'
      }
    });

    // Generar tokens
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
