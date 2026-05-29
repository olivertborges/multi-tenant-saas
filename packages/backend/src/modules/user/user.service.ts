import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { hash } from 'argon2';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async listUsers(tenantId: string, query: ListUsersQueryDto) {
    const { page = 1, limit = 10, search, role, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, deletedAt: null };
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(user => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUser(tenantId: string, userId: string) {
    const cacheKey = `user:${userId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const sanitized = this.sanitizeUser(user);
    await this.redis.set(cacheKey, JSON.stringify(sanitized), 300);
    
    return sanitized;
  }

  async createUser(tenantId: string, createdBy: string, createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email_tenantId: { email, tenantId } },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    const hashedPassword = await hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        tenantId,
        role: role || 'EMPLOYEE',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId: createdBy,
        action: 'CREATE_USER',
        entityType: 'user',
        entityId: user.id,
        newValues: { email, name, role },
      },
    });

    await this.redis.delPattern(`users:list:${tenantId}:*`);

    return this.sanitizeUser(user);
  }

  async updateUser(tenantId: string, userId: string, updateUserDto: UpdateUserDto) {
    await this.getUser(tenantId, userId);

    const updateData: any = {};
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.role) updateData.role = updateUserDto.role;
    if (updateUserDto.isActive !== undefined) updateData.isActive = updateUserDto.isActive;
    
    if (updateUserDto.password) {
      updateData.password = await hash(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.redis.del(`user:${userId}`);
    await this.redis.delPattern(`users:list:${tenantId}:*`);

    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(tenantId: string, userId: string) {
    await this.getUser(tenantId, userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), isActive: false },
    });

    await this.prisma.session.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    await this.redis.del(`user:${userId}`);
    await this.redis.delPattern(`users:list:${tenantId}:*`);

    return { message: 'Usuario eliminado correctamente' };
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
