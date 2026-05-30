import { Controller, Get, Post, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get('product/:productId/rating')
  async getAverageRating(@Param('productId') productId: string) {
    return this.reviewsService.getAverageRating(productId);
  }

  @Post()
  async createReview(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId;
    return this.reviewsService.createReview(userId, body.productId, body.rating, body.comment);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.reviewsService.deleteReview(id, userId);
  }
}
