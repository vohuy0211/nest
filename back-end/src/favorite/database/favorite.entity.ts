import {
  Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';

import { Product } from '../../product/database/product.entity';
import { User } from '../../user/database/user.entity';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @Column({ default: 1 })
  like: number;

  @ManyToOne(() => User, (user) => user.favorite)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.favorite)
  @JoinColumn({ name: 'productId' })
  product: Product;
}