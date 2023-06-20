import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
  @InjectRepository(Product) private productRepository: Repository<Product>,
  @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}


  async addToCart(id: string, user: User) {
    const thisItem = this.productRepository.findOne({where: {
      id: id
    }})
    const thisUser = this.userRepository.findOne({where: {
      id: user.id
    }})
    await this.userRepository.update({id: user.id}, { cart: (await thisUser).cart + (await thisItem).price})
    const newToCart = await {userId: user.id, itemId: id}
    return await this.cartRepository.save(newToCart)
  }
    
}
