import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Product } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { Cart } from './entities/cart.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Product, Order, Cart])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
