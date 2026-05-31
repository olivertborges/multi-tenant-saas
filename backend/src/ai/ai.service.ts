import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AIService {
  async chat(message: string, userId: string, tenantId: string) {
    const lowerMessage = message.toLowerCase();
    
    const [user, tenant, products] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.product.findMany({ where: { tenantId, isActive: true }, take: 5 })
    ]);

    let response = '';

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días')) {
      response = `¡Hola ${user?.name}! Bienvenido a ${tenant?.name}. ¿En qué puedo ayudarte hoy?`;
    } else if (lowerMessage.includes('producto') || lowerMessage.includes('precio')) {
      if (products.length > 0) {
        response = `Tenemos ${products.length} productos disponibles. Por ejemplo: ${products[0].name} por $${products[0].price}. ¿Te gustaría ver más detalles?`;
      } else {
        response = 'Pronto tendremos productos disponibles. ¡Te avisaremos!';
      }
    } else if (lowerMessage.includes('compra') || lowerMessage.includes('pedido')) {
      response = 'Puedes revisar tus compras en la sección "Mis Compras". ¿Necesitas ayuda con algo específico?';
    } else if (lowerMessage.includes('punto') || lowerMessage.includes('puntos')) {
      response = `Actualmente tienes ${user?.points || 0} puntos. ¡Sigue comprando para acumular más beneficios!`;
    } else if (lowerMessage.includes('gracias')) {
      response = '¡De nada! Estoy aquí para ayudarte. ¿Algo más en lo que pueda asistirte?';
    } else {
      response = `Gracias por tu mensaje. En ${tenant?.name}, queremos ayudarte. ¿Puedes darme más detalles sobre tu consulta?`;
    }

    // Guardar en historial
    const aIConversation = await prisma.aIConversation.create({
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
      categories.filter(v => v === a).length - categories.filter(v => v === b).length
    ).pop();

    if (topCategory) {
      const recommendations = await prisma.product.findMany({
        where: { category: topCategory, isActive: true, tenantId },
        take: 5,
      });
      return recommendations;
    }
    
    return prisma.product.findMany({
      where: { tenantId, isActive: true },
      orderBy: { price: 'asc' },
      take: 5,
    });
  }
}
