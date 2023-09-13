import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Comment } from '../../comment/database/comment.entity';
import { Favorite } from '../../favorite/database/favorite.entity';
import { History } from '../../history/database/history.entity';
import { OrderItem } from '../../orderItem/database/orderItem.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameBook: string;

  @Column()
  quantityBook: number;

  @Column()
  author: string;

  @Column()
  img: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  price: string;

  @OneToMany(() => History, history => history.products)
  history: History[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comment: Comment[]


  @OneToMany(() => OrderItem, (orderItem) => orderItem.products)
  orderItem: OrderItem[]


  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorite: Favorite[];
}