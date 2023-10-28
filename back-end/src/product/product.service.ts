
import { ILike, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './database/product.entity';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product)
  private ProductRepo: Repository<Product>,
  ) { }
  async findAll() {
    try {
      return await this.ProductRepo.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id: number) {
    try {
      return await this.ProductRepo.findOneBy({ id });
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(data: ProductDTO) {
    const product = {
      nameBook: data.nameBook,
      img: data.img,
      quantityBook: data.quantityBook,
      price: data.price,
      author: data.author,
      description: data.description,
      category: data.category
    }
    console.log(product);

    try {
      this.ProductRepo.create(product as any);
      await this.ProductRepo.save(product as any);
      return { message: 'Product created successfully' }
    } catch (error) {
      console.log(error);
    }
    return this.ProductRepo.create(product as any);
  }

  async updateProduct(id: number, data: ProductDTO) {
    try {
      const updateProduct = await this.ProductRepo.findOneBy({ id });
      await this.ProductRepo.update(id, data as any);

      return { message: 'Product updated successfully' };

    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id: number) {
    try {
      this.ProductRepo.delete(id);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.log(error);

    }
  }

  async findByName(name: string) {
    try {
      return await this.ProductRepo.find({
        where: {
          nameBook: ILike(`%${name}%`),
          // author: ILike(`%${author}%`),
          // category: ILike(`%${category}%`),
        }
      })
    } catch (error) {
      console.log(error);
    }
  }


}