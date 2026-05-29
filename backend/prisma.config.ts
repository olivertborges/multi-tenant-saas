import { PrismaConfig } from 'prisma';

export default {
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
} satisfies PrismaConfig;
