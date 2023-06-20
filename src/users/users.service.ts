import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/order/entities/order.entity';
import { Cart } from 'src/order/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderUserDto } from './dto/order-user.dto';
import { ConfigService } from '@nestjs/config';
import { typeOrmConfig } from 'src/config/typeorm.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly config: ConfigService,
  ) {}
  async showCart(user: User) {
    return await this.cartRepository.find({where: {userId: user.id}})

  }

  async getMe(user: User) {
    return await this.userRepository.find({ where: { id: user.id } });
  }

  async confirmCart(user: User) {
    const cart = await this.cartRepository.find({where: {
      userId: user.id
    }, 
  select: {
    userId: true,
     itemId: true,
  }})
    for (let i = 0; i < cart.length; i ++) {
      const item = await this.productRepository.findOne({ where: { id: cart[i].itemId} })
        await this.orderRepository.save(cart[i])
      }
    return 'done!'
  }

  async order(orderUserDto: OrderUserDto, user: User) {
    const orderId = await Math.floor(
      Math.random() * (9999 - 1000 + 1) + 1000,
    );
    const orders = await this.orderRepository.find({where: {
      userId: user.id
    }})
    await this.orderRepository.update({userId: user.id}, {orderId: orderId})
    const thisUser = await this.userRepository.findOne({where: {id: user.id}})
    console.log(thisUser);
    
    const request = await require('request');
    const options = {
      method: 'POST',
      url: 'https://api.idpay.ir/v1.1/payment',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.get('IDPAY_APIKEY'),
        'X-SANDBOX': 1,
      },
      body: {
        order_id: orders[0].orderId,
        amount: (await thisUser).cart,
        name: orderUserDto.firstName + " " +  orderUserDto.lastName,
        phone: orderUserDto.phoneNumber,
        desc: orderUserDto.desc,
        callback: 'http://localhost:3333/confirmOrder',
      },
      json: true,
    };
    
    await request(options, function (error, response, body) {
      const mydatasource = new DataSource( {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: typeOrmConfig['username'],
        password: typeOrmConfig['password'],
        database: 'mitest',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }
       )
       
       const orderRepository = mydatasource.getRepository(Order)
       console.log(orderRepository);
       orderRepository.update({userId: user.id}, {paymentLink: body['link'], paymentId: body['id']})
      if (error) throw new Error(error);
      console.log(body);
    });
    return (await this.orderRepository.findOne({where: {userId: user.id}})).paymentLink

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
    await this.userRepository.update({id: user.id}, {cart: (await thisUser).cart - (await thisItem).price})
    return await this.cartRepository.delete({userId: user.id, itemId: id})
    
  }
}
