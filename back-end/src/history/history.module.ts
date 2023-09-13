import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../product/database/product.entity';
import { History } from './database/history.entity';
import { HistoryController } from './history.controllers';
import { HistoryService } from './history.service';

@Module({
  imports: [TypeOrmModule.forFeature([History, Product])],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule { }