import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../oder/database/order.entity';
import { OrderItem } from './database/orderItem.entity';
import { OrderItemController } from './OrderItem.controllers';
import { OrderItemService } from './OrderItem.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order])],
  controllers: [OrderItemController],
  providers: [OrderItemService]
})

export class OrderItemModule { }