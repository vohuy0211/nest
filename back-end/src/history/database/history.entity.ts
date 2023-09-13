import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { Order } from '../../oder/database/order.entity';
import { OrderItem } from '../../orderItem/database/orderItem.entity';
import { Product } from '../../product/database/product.entity';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalPrice: number;

  @Column()
  orderDate: string;

  @Column()
  quantity: number;

  @Column()
  status: number;

  @Column()
  productId: number;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: number;

  @Column()
  address: string;

  @Column()
  orderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.history)
  @JoinColumn({ name: 'productId' })
  products: Product;

  // @ManyToOne(() => OrderItem, (orderItem) => orderItem.history)
  // @JoinColumn({ name: 'orderItemId' })
  // orderItem: OrderItem;

  @ManyToOne(() => Order, (order) => order.history)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}