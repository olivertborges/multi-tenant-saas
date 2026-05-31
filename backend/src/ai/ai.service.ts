import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(message: string, userId: string, tenantId: string) {
    // Obtener contexto del usuario y tenant
    const [user, tenant, products] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.product.findMany({ where: { tenantId, isActive: true }, take: 10 }),
    ]);

    const systemPrompt = `Eres un asistente de ventas para ${tenant.name}. 
    Ayuda a los clientes con sus dudas sobre productos.
    Productos disponibles: ${products.map(p => p.name).join(', ')}.
    El usuario se llama ${user?.name}. Sé amable y útil.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    
    // Guardar en historial
    await prisma.aiConversation.create({
      data: {
        userId,
        tenantId,
        message,
        response,
      }
    });

    return response;
  }

  async recommendProducts(userId: string, tenantId: string) {
    const purchases = await prisma.purchase.findMany({
      where: { userId, tenantId },
      include: { items: { include: { product: true } } },
      take: 10,
    });
    
    const categories = purchases.flatMap(p => p.items.map(i => i.product.category));
    const topCategory = categories.sort((a,b) => 
      categories.filter(v => v===a).length - categories.filter(v => v===b).length
    ).pop();

    const recommendations = await prisma.product.findMany({
      where: { category: topCategory, isActive: true, tenantId },
      take: 5,
    });
    
    return recommendations;
  }
}
