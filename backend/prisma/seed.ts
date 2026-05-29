import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear un tenant demo
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'Empresa Demo',
    },
  });

  // Crear roles por defecto
  const roles = [
    { name: 'ADMIN', permissions: ['*'] },
    { name: 'MANAGER', permissions: ['users:read', 'users:write', 'reports:read', 'dashboard:read'] },
    { name: 'EMPLOYEE', permissions: ['dashboard:read', 'tasks:read', 'tasks:write'] },
    { name: 'VIEWER', permissions: ['dashboard:read'] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name_tenantId: { name: role.name, tenantId: tenant.id } },
      update: {},
      create: {
        name: role.name,
        permissions: role.permissions,
        tenantId: tenant.id,
      },
    });
  }

  console.log('✅ Seed completado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
