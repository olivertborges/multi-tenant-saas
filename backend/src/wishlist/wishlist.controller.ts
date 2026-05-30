import { Controller, Get, Post, Delete, Body, Param, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@Req() req: any) {
    const userId = req.user?.userId;
    const items = await this.wishlistService.getWishlist(userId);
    return items || [];
  }

  @Post('add')
  async addToWishlist(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    return this.wishlistService.addToWishlist(userId, body.productId);
  }

  @Delete('remove/:productId')
  async removeFromWishlist(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get('check/:productId')
  async isInWishlist(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.userId;
    const inWishlist = await this.wishlistService.isInWishlist(userId, productId);
    return { inWishlist };
  }
}
