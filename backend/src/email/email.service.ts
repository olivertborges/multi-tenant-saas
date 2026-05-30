import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(userEmail: string, userName: string, tenantName: string) {
    await this.transporter.sendMail({
      from: `"SaaS Enterprise" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Bienvenido a SaaS Enterprise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">¡Bienvenido, ${userName}!</h1>
          <p>Tu cuenta en <strong>${tenantName}</strong> ha sido creada exitosamente.</p>
          <p>Ya puedes comenzar a usar nuestra plataforma.</p>
          <a href="${process.env.FRONTEND_URL}/login" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Iniciar Sesión</a>
        </div>
      `
    });
  }

  async sendPurchaseConfirmation(userEmail: string, userName: string, purchaseId: string, total: number) {
    await this.transporter.sendMail({
      from: `"SaaS Enterprise" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Confirmación de compra',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">¡Gracias por tu compra, ${userName}!</h1>
          <p>Tu compra #${purchaseId.slice(0,8)} ha sido confirmada.</p>
          <p><strong>Total:</strong> $${total}</p>
          <a href="${process.env.FRONTEND_URL}/purchases" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Ver mis compras</a>
        </div>
      `
    });
  }

  async sendAppointmentConfirmation(userEmail: string, userName: string, serviceName: string, date: string, time: string) {
    await this.transporter.sendMail({
      from: `"SaaS Enterprise" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Confirmación de reserva',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">¡Reserva confirmada, ${userName}!</h1>
          <p><strong>Servicio:</strong> ${serviceName}</p>
          <p><strong>Fecha:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> ${time}</p>
          <a href="${process.env.FRONTEND_URL}/agendas" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Ver mis reservas</a>
        </div>
      `
    });
  }
}
