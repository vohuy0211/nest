import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('api/v1/order')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Post("postOrder")
  postOrder(@Body() body: OrderDTO) {
    // console.log("body", body)
    try {
      return this.orderService.postOrder(body)
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getAllOrder() {
    try {
      return await this.orderService.getAllOrder();
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    try {
      return await this.orderService.getOrderById(id);
    } catch (error) {
      console.log(error);
    }
  }
}