import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
}

// Para Vercel serverless
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();
  // Esto es simplificado - para producción real necesitas más configuración
  res.status(200).json({ message: 'API funcionando' });
}
