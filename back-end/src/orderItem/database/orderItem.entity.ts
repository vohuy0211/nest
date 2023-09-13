import {
  Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { History } from '../../history/database/history.entity';
import { Order } from '../../oder/database/order.entity';
import { Product } from '../../product/database/product.entity';

@Entity('orderItem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  quantityOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderItem)
  @JoinColumn({ name: 'orderId' })
  order: Order

  @ManyToOne(() => Product, (product) => product.orderItem)
  @JoinColumn({
    name:
      "productId"
  })
  products: Product

  // @OneToMany(() => History, (history) => history.orderItem)
  // history: History[];
}