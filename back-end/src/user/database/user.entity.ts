import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { Comment } from '../../comment/database/comment.entity';
import { Favorite } from '../../favorite/database/favorite.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: number;

  @Column()
  address: string;

  @Column()
  role: number;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorite: Favorite[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[]
}