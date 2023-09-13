import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../orm.config';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { HistoryModule } from './history/history.module';
import { OrderModule } from './oder/order.module';
import { OrderItemModule } from './orderItem/OrderItem.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    OrderModule,
    ProductModule,
    OrderItemModule,
    HistoryModule,
    FavoriteModule,
    CommentModule
  ],
})
export class AppModule { }
