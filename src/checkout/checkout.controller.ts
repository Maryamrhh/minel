import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { OrderCheckoutDto } from './dto/order-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { JwtGaurd } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGaurd)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('shipping')
  create(@Body() orderCheckoutDto: OrderCheckoutDto, @GetUser() user: User) {
    return this.checkoutService.create(orderCheckoutDto, user);
  }

  @Get('cart')
  cart(@GetUser() user: User) {
    return this.checkoutService.showCart(user);
  }

  @Get('payment')
  payment(@GetUser() user: User) {
    return this.checkoutService.payment(user);
  }

  @Get('confirm')
  confirm(@GetUser() user: User) {
    return this.checkoutService.confirm(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkoutService.remove(+id);
  }
}
