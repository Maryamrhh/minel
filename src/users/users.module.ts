import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from 'src/checkout/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from 'src/checkout/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Order, Product])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
