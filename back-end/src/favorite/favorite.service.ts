import { ILike, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Favorite } from './database/favorite.entity';
import { FavoriteDTO } from './dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(@InjectRepository(Favorite)
  private FavoriteRepo: Repository<Favorite>
  ) { }

  async postFavorites(data: FavoriteDTO) {
    try {
      const existingFavorite = await this.FavoriteRepo.findOneBy({
        userId: data.userId,
        productId: data.productId
      });
      console.log("1111", existingFavorite);

      if (existingFavorite) {
        return { message: 'Sản phẩm đã được yêu thích trước đó' };
      }

      const favorites = {
        userId: data.userId,
        productId: data.productId
      };

      try {
        this.FavoriteRepo.create(favorites);
        await this.FavoriteRepo.save(favorites);
        return { message: 'Đã thêm vào danh sách yêu thích' };
      } catch (error) {
        console.log(error);
        return { message: 'Có lỗi xảy ra khi tạo yêu thích' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'Có lỗi xảy ra khi kiểm tra yêu thích' };
    }
  }

  async getFavorites(id: number) {
    try {
      const listFavorites = await this.FavoriteRepo.find({
        where: { userId: id },
        relations: ['product']
      })
      return listFavorites
    } catch (error) {
      console.log(error);
    }
  }

  async deleteListFavorites(id: number) {
    try {
      this.FavoriteRepo.delete({ productId: id });
      return ({ msg: "xoá thành công" })
    } catch (error) {
      console.log(error);

    }
  }
}