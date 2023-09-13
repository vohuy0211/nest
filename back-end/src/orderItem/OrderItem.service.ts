import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from '../oder/database/order.entity';
import { OrderItem } from './database/orderItem.entity';
import { OrderItemDTO } from './dto/orderItem.dto';

@Injectable()

export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private OrderItemRepo: Repository<OrderItem>,
  ) { }

  async getOrderItem() {
    try {
      return await this.OrderItemRepo
        .createQueryBuilder('orderItem')
        .leftJoinAndSelect('orderItem.products', 'products')
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async handleGetOderItemById(userId: number) {
    try {
      const orderItemUserById = await this.OrderItemRepo.find({
        where: {
          orderId: userId
        },
        relations: ['products']
      })
      return orderItemUserById
    } catch (error) {
      console.log(error);
    }
  }

  async postOrderItem(data: OrderItemDTO) {
    const orderItem = {
      orderId: data.orderId,
      productId: data.productId,
      quantityOrder: data.quantityOrder,
    }
    try {
      const orderItemByIdUser = await this.OrderItemRepo.findOne({
        where: {
          orderId: data.orderId,
          productId: data.productId,
        },
      })

      if (orderItemByIdUser) {
        //Nếu orderItem đã tồn tại thì cộng thêm quantity 
        orderItemByIdUser.quantityOrder += data.quantityOrder;
        await this.OrderItemRepo.save(orderItemByIdUser)
        return { message: 'Cập nhật giỏ hàng thành công', data: orderItemByIdUser };
      } else {
        //Nếu orderItem chưa có trong bảng thì tạo mới
        const newOrderItem = this.OrderItemRepo.create({
          orderId: data.orderId,
          productId: data.productId,
          quantityOrder: data.quantityOrder,
        });

        const result = await this.OrderItemRepo.save(newOrderItem);
        return { message: 'Thêm vào giỏ hàng thành công', data: result };
      }
    } catch (error) {
      console.log(error);

    }
  }

  async updateOrderItem(id: number, data: OrderItemDTO) {
    try {
      const updateOrderItem = await this.OrderItemRepo.findOneBy({ id });
      await this.OrderItemRepo.update(id, data as any);
    } catch (error) {
      console.log(error);

    }
  }

  async handleDeleteItem(id: number) {
    try {
      const deleteResult = await this.OrderItemRepo.delete(id);

      if (deleteResult.affected === 1) {
        return { message: 'Order item deleted successfully' };
      } else {
        return { message: 'Order item not found or failed to delete' };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Failed to delete order item');
    }
  }

  async deleteOrderItemById(orderId: number): Promise<{ message: string }> {
    try {
      const orderItem = await this.OrderItemRepo.find({
        where: { orderId: orderId }
      });


      if (orderItem) {
        await this.OrderItemRepo.delete({ orderId });
        return { message: 'Order item deleted successfully' };
      } else {
        return { message: 'Order item not found' };
      }
    } catch (error) {
      return { message: error.message }
    }
  }
}