import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './database/order.entity';
import { OrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order)
  private OrderRepo: Repository<Order>) { }

  async postOrder(data: OrderDTO) {
    const order = {
      status: data.status,
      userId: data.userId,
    }
    console.log("data =======>", data)
    console.log("order =======>", order)

    try {
      const orderByIdUser = await this.OrderRepo.findOne({
        where: { userId: data.userId }
      });
      console.log(
        "orderByIdUser", orderByIdUser
      )
      if (!orderByIdUser) {
        const result = this.OrderRepo.create(order);
        await this.OrderRepo.save(result)
        return { msg: 'Order create successfully', result }
      } else {
        orderByIdUser.status = data.status;
        await this.OrderRepo.save(orderByIdUser);
        return { message: 'Order updated successfully', result: orderByIdUser };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create or update order');
    }
  }

  async getAllOrder() {
    try {
      return await this.OrderRepo.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderById(id: number) {
    try {
      return await this.OrderRepo.findOne({
        where: { userId: id }
      });
    } catch (error) {
      throw new Error('Failed to retrieve order by ID');
    }
  }


}