import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.cartService.getCart(userId, tenantId);
  }

  @Post('add')
  async addItem(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    const tenantId = req.user?.tenantId;
    return this.cartService.addItem(userId, body.productId, body.quantity, tenantId);
  }

  @Put('item/:id')
  async updateItem(@Param('id') id: string, @Body() body: any) {
    return this.cartService.updateItem(id, body.quantity);
  }

  @Delete('item/:id')
  async removeItem(@Param('id') id: string) {
    return this.cartService.removeItem(id);
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    const userId = req.user?.userId;
    return this.cartService.clearCart(userId);
  }
}
