import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order, Product, Payment])],
  controllers: [CheckoutController],
  providers: [CheckoutService]
})
export class CheckoutModule {}
