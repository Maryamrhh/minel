import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { OrderCheckoutDto } from './dto/order-checkout.dto';
import { Order } from './entities/order.entity';
import { dataConfig } from 'src/config/datasource.config';
import * as request from 'request';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>, 
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    private config: ConfigService) {}
  async create(orderCheckoutDto: OrderCheckoutDto, user: User) {
    const userCart = await this.cartRepository.findOne({where: { userId: user.id}})
    const newOrder = { ...orderCheckoutDto, amount: userCart.amount, items: userCart.items, phoneNumber: user.phoneNumber, userId: user.id}
    return await this.orderRepository.save(newOrder)
  }

  showCart(user: User) {
    return this.cartRepository.findOne({where: {
      userId: user.id
    }, select : {
      items: true, 
      amount: true
    }})
  }

  async payment(user: User) {
    const userOrder = await this.orderRepository.findOne({where: { userId: user.id, payment: false}})
    if (!userOrder) throw new ForbiddenException('There is no active order!')
    const existPayment = await this.paymentRepository.findOne({where: {id: userOrder.id}})
    if (existPayment) {
      console.log(existPayment);
      
      return existPayment.paymentLink

    }

      const options = {
        method: 'POST',
        url: 'https://api.idpay.ir/v1.1/payment',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.config.get('IDPAY_APIKEY'),
          'X-SANDBOX': 1,
        },
        body: {
          order_id: userOrder.id,
          amount: userOrder.amount,
          name: userOrder.firstName + " " +  userOrder.lastName,
          phone: userOrder.phoneNumber,
          desc: "",
          callback: 'http://localhost:3333/checkout/confirm',
        },
        json: true,
      };
      request(options, async function (error, response, body) {
        if (error) throw new Error(error);
        const myDataSource = await new DataSource(dataConfig).initialize()
        const queryRunner = myDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
          let newPayment = {id: userOrder.id, amount: userOrder.amount, userId: user.id, paymentId: body['id'], paymentLink: body['link']}
          await queryRunner.manager.save(Payment, newPayment);
          console.log(newPayment);
          await queryRunner.commitTransaction()
        } catch (err) {
          await queryRunner.rollbackTransaction()
        } finally {
          await queryRunner.release()
        }
      });
    return (await this.paymentRepository.findOne({where: {id: userOrder.id},select: {paymentLink: true}} )).paymentLink

    }
  

  async confirm(user: User) {
    const thisPayment = await this.paymentRepository.findOne({where: {userId: user.id, status: false}})
    var options = {
      method: 'POST',
      url: 'https://api.idpay.ir/v1.1/payment/verify',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.get('IDPAY_APIKEY'),
        'X-SANDBOX': 1,
      },
      body: {
        'id': thisPayment.paymentId,
        'order_id': thisPayment.id,
      },
      json: true,
    };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const myDataSource = await new DataSource(dataConfig).initialize()
        const queryRunner = myDataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
          await queryRunner.manager.update(Payment, {id: thisPayment.id}, {trackId: body['track_id'], cardNo: body['card_no'], status: true})
          await queryRunner.manager.update(Order, {id: thisPayment.id}, {payment: true, trackId: body['track_id']})
          await queryRunner.manager.update(Cart, {userId: user.id}, {items: [], amount: 0})
          await queryRunner.commitTransaction()
        } catch (err) {
          await queryRunner.rollbackTransaction()
        } finally {
          await queryRunner.release()
        }
    
      console.log(body);
    });
    return (await this.paymentRepository.findOne({where: {id: thisPayment.id}})).trackId

  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
