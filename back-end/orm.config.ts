
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { Comment } from './src/comment/database/comment.entity';
import { Favorite } from './src/favorite/database/favorite.entity';
import { History } from './src/history/database/history.entity';
import { Order } from './src/oder/database/order.entity';
import { OrderItem } from './src/orderItem/database/orderItem.entity';
import { Product } from './src/product/database/product.entity';
import { User } from './src/user/database/user.entity';

require('dotenv').config();
console.log(process.env.DB_PASSWORD, 'Database');

export const config: MysqlConnectionOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  type: 'mysql',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'huyvo02112003',
  database: process.env.DB_DATABASE || 'projectnestjs',
  entities: [Product, User, Order, OrderItem, History, Favorite, Comment],
  synchronize: false,
}