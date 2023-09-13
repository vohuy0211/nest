import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Favorite } from './database/favorite.entity';
import { FavoriteController } from './favorite.controllers';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavoriteController],
  providers: [FavoriteService]
})
export class FavoriteModule { }