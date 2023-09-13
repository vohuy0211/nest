import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { OrderItemDTO } from './dto/orderItem.dto';
import { OrderItemService } from './OrderItem.service';

@Controller('/api/v1/orderItem')

export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {
  }

  @Post('postOrderItem')
  async postOrderItem(@Body() body: OrderItemDTO) {
    try {
      return this.orderItemService.postOrderItem(body);
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getAllOrderItems() {
    try {
      return await this.orderItemService.getOrderItem()
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getOrderItemById(@Param('id') id: number) {
    try {
      return await this.orderItemService.handleGetOderItemById(id)
    } catch (error) {
      console.log(error);

    }
  }

  @Patch(':id')
  async patchOrderItemById(@Param('id') id: number, @Body() body: OrderItemDTO) {
    try {
      return await this.orderItemService.updateOrderItem(id, body)
    } catch (error) {
      console.log(error);

    }
  }

  @Delete('ById/:id')
  async deleteOrderItem(@Param('id') id: number) {
    try {
      return this.orderItemService.handleDeleteItem(id);
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':orderId')
  async deleteOrderItemCheckout(@Param('orderId') orderId: number) {
    try {
      return this.orderItemService.deleteOrderItemById(orderId)
    } catch (error) {
      console.log(error);

    }
  }
}