import {
  Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res
} from '@nestjs/common';

import { FavoriteDTO } from './dto/favorite.dto';
import { FavoriteService } from './favorite.service';

@Controller('/api/v1/favorite')
export class FavoriteController {
  constructor(public favoriteService: FavoriteService) {

  }
  @Post()
  async createFavorite(@Body() body: FavoriteDTO) {
    try {
      return await this.favoriteService.postFavorites(body)
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getListFavorites(@Param('id') id: number) {
    try {
      return await this.favoriteService.getFavorites(id)
    } catch (error) {
      console.log(error);
    }
  }

  @Delete(':id')
  async deleteFavorite(@Param('id') id: number) {
    try {
      return await this.favoriteService.deleteListFavorites(id)
    } catch (error) {
      console.log(error);
    }
  }
}