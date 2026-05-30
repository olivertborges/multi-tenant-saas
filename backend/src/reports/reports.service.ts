import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

const prisma = new PrismaClient();

@Injectable()
export class ReportsService {
  async generateSalesReport(tenantId: string, startDate: Date, endDate: Date, res: Response) {
    const purchases = await prisma.purchase.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate, lte: endDate }
      },
      include: {
        user: true,
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalSales = purchases.reduce((sum, p) => sum + p.total, 0);
    const totalOrders = purchases.length;

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Reporte de Ventas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    doc.text(`Total de Ventas: $${totalSales}`);
    doc.text(`Total de Órdenes: ${totalOrders}`);
    doc.moveDown();
    
    purchases.forEach((purchase, i) => {
      doc.fontSize(14).text(`Orden #${i + 1}`);
      doc.fontSize(10).text(`Fecha: ${purchase.createdAt.toLocaleDateString()}`);
      doc.text(`Cliente: ${purchase.user.name}`);
      doc.text(`Total: $${purchase.total}`);
      doc.moveDown();
    });

    doc.end();
  }

  async generateExcelReport(tenantId: string, startDate: Date, endDate: Date, res: Response) {
    const purchases = await prisma.purchase.findMany({
      where: {
        tenantId,
        createdAt: { gte: startDate, lte: endDate }
      },
      include: { user: true, items: { include: { product: true } } }
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: 'Fecha', key: 'date', width: 15 },
      { header: 'Cliente', key: 'customer', width: 20 },
      { header: 'Productos', key: 'products', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Estado', key: 'status', width: 15 }
    ];

    purchases.forEach(purchase => {
      worksheet.addRow({
        id: purchase.id.slice(0,8),
        date: purchase.createdAt.toLocaleDateString(),
        customer: purchase.user.name,
        products: purchase.items.map(i => `${i.product.name} x${i.quantity}`).join(', '),
        total: purchase.total,
        status: purchase.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-ventas.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  }
}
