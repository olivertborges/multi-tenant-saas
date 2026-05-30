import { Controller, Get, Post, Put, Delete, Body, Param, Headers, Req } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.findAll(tenantId);
  }

  @Get('related/:id')
  async getRelated(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.getRelatedProducts(id, tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.findOne(id, tenantId);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.create(body, tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.update(id, body, tenantId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.tenantId;
    return this.productsService.delete(id, tenantId);
  }
}
