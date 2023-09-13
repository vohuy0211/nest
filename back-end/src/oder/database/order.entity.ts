import {
  Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { History } from '../../history/database/history.entity';
import { OrderItem } from '../../orderItem/database/orderItem.entity';
import { User } from '../../user/database/user.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItem: OrderItem[];

  @OneToMany(() => History, (history) => history.order)
  history: History[];
}