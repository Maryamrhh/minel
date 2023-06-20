import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGaurd } from 'src/auth/guard';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGaurd)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get(':id')
  addToCart(@Param('id') id: string, @GetUser() user: User) {
    return this.orderService.addToCart(id, user);
  }
}
