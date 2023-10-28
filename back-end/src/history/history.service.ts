import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from '../product/database/product.entity';
import { History } from './database/history.entity';
import { HistoryDTO } from './dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private HistoryRepo: Repository<History>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }
  async handlePostHistory(data: HistoryDTO) {
    console.log(data);

    const history = {
      totalPrice: data.totalPrice,
      orderDate: data.orderDate,
      quantity: data.quantity,
      status: data.status,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      orderId: data.orderId,
      productId: data.productId
    }
    console.log(history);
    try {
      const savedHistory = await this.HistoryRepo.save(history as any);
      // Lấy thông tin sách từ lịch sử
      const bookId: number = data.productId;// Đây cần phải thay bằng ID thật của sản phẩm
      console.log("id của sách ==>", bookId);

      const historyQuantity = data.quantity;
      console.log("quantity của lịch sử ==>", historyQuantity);
      const book = await this.productRepo.findOneBy({ id: bookId });
      console.log(book);


      // Kiểm tra nếu sách tồn tại và số lượng đủ để trừ
      if (book && book.quantityBook >= historyQuantity) {
        // Trừ quantityBook
        book.quantityBook = Number(book.quantityBook) - Number(historyQuantity);
        await this.productRepo.save(book);
      } else {
        throw new Error('Số lượng sách không đủ');
      }

      return savedHistory;
    } catch (error) {
      console.log(error);
      throw new Error('Lỗi khi tạo lịch sử hoặc cập nhật sách');
    }
  }

  async handleGetHistoryById(id: number) {
    try {
      const historyUser = await this.HistoryRepo.find({
        where: { orderId: id as any },
        relations: ['products']
      });
      return historyUser;
    } catch (error) {
      console.log(error);
    }
  }

  async handleGetAllHistory() {
    try {
      const dataHistory = await this.HistoryRepo.find({
        relations: ['products'],
      })
      return dataHistory;
    } catch (error) {
      console.log(error);
    }
  }

  async handlePatchHistory(id: number, data: HistoryDTO) {
    try {
      const updateHistory = await this.HistoryRepo.findOneBy({ id });
      await this.HistoryRepo.update(id, data as any);
      return { message: 'Product updated successfully' };
    } catch (error) {
      console.log(error);
    }
  }

  async getHistoryById(id: number) {
    try {
      // const historyItem = await this.HistoryRepo.findOne(id, {
      //   relations: ['orders', 'orders.user', 'products', 'orderItems'],
      // });
      const historyItem = await this.HistoryRepo.findOne({
        where: { id: id }
      });
      console.log(historyItem);

      return historyItem;
    } catch (error) {
      throw new Error('Lỗi khi truy vấn dữ liệu lịch sử');
    }
  }

  async deleteHistoryById(id: number) {
    try {
      const deletedHistory = await this.HistoryRepo.delete(id);
      if (deletedHistory.affected === 1) {
        return { message: 'History deleted successfully' };
      } else {
        throw new Error('Không tìm thấy lịch sử để xóa');
      }
    } catch (error) {
      console.log(error);
      throw new Error('Lỗi khi xóa lịch sử');
    }
  }
}