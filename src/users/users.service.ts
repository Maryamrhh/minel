import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/checkout/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderUserDto } from './dto/order-user.dto';
import { ConfigService } from '@nestjs/config';
import { Cart } from 'src/checkout/entities/cart.entity';
import { dataConfig } from 'src/config/datasource.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly config: ConfigService,
  ) {}

  async getMe(user: User) {
    return await this.userRepository.find({ where: { id: user.id } });
  }

  async editeProfile(updateUserDto: UpdateUserDto, user: User) {
    const saltOrRounds = 10;
    const password = updateUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return await this.userRepository.update(
      { id: user.id },
      { ...updateUserDto, password: hash },
    );
  }

  async removeFromCart(id: string, user: User) {
    const thisItem = this.productRepository.findOne({where: {
      id: id
    }})
    const thisUser = this.userRepository.findOne({where: {
      id: user.id
    }})
    
  }

  async addToCart(id: string, itemNumber: number, user: User) { 
    const thisItem = await this.productRepository.findOne({where: {
      id: id
    }})
    const thisCart = await this.cartRepository.findOne({where: {
      userId: user.id
    }})    
    const existItem = thisCart.items.findIndex((obj => obj.item == thisItem.id));   
    const myDataSource = await new DataSource(dataConfig).initialize()
    const queryRunner = myDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      if (existItem != -1) {
        let newItems = thisCart.items
        const newAmount = thisCart.amount - (newItems[existItem].number * newItems[existItem].price)
        delete newItems[existItem]
        newItems = newItems.filter(function (element) { return element !== undefined || element !== null; })
        await queryRunner.manager.update(Cart, {id: thisCart.id}, {items: newItems, amount: newAmount})}
      if (itemNumber != 0) {
        const thisNewCart = await queryRunner.manager.findOne(Cart, {where: {
          userId: user.id
        }})
        const newToCart = { item: thisItem.id, price: thisItem.price, number: itemNumber }
        await queryRunner.manager.update(Cart, {id: thisCart.id}, {items: [ ...thisNewCart.items, newToCart], amount: thisNewCart.amount + (thisItem.price * itemNumber) })
      }
      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
    }


        
  }
}
