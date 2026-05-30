import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
  permissions: string[];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://multi-tenant-saas.netlify.app',
    'https://multi-tenant-saas2.netlify.app'
  ],
  credentials: true,
});
  
  // Middleware para extraer tenant del token
  app.use((req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, 'secret-key') as JwtPayload;
        req.user = decoded;
        req.headers['x-tenant-id'] = decoded.tenantId;
      } catch (e) {
        // Token inválido, seguir sin user
        console.log('Token inválido:', e.message);
      }
    }
    next();
  });
  
  app.setGlobalPrefix('api');
  
const port = process.env.PORT || 3001;
await app.listen(port);
console.log(`🚀 Backend corriendo en puerto ${port}`);
}
bootstrap();
