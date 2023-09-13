import {
  Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { multerUpload } from '../config/multer';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('/api/v1/product')
export class ProductController {
  constructor(public productService: ProductService) {

  }
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'img', maxCount: 1 }], multerUpload),
  )
  createUser(@Body() body: ProductDTO, @UploadedFiles() files: any) {
    console.log("ra chưa ===>", files);
    if (files.img) {
      body.img = files.img[0].path;
    }
    return this.productService.createProduct(body);
  }
  // Update sản phẩm
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'img', maxCount: 1 }], multerUpload),
  )
  @Patch(':id')
  async editUserById(@Param('id') id: number, @Body() body: ProductDTO, @UploadedFiles() files: any) {
    try {
      console.log("ra chưa img===>", files);
      if (files.img) {
        body.img = files.img[0].path;
      }
      return this.productService.updateProduct(id, body);
    } catch (error) {
      console.log(error);
    }
  }
  // Xoá sản phẩm
  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    try {
      return this.productService.deleteProduct(id);
    } catch (error) {
      console.log(error);
    }
  }
  // Lấy tất cả sản phẩm
  @Get('getBook')
  async getAllProduct() {
    try {
      return this.productService.findAll();
    } catch (error) {
      console.log(error);

    }
  }
  // Lấy sản phẩm theo id
  @Get('getBook/:id')
  async getProductById(@Param('id') id: number) {
    try {
      return this.productService.getProductById(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
  // Search sản phẩm
  @Get('search/:name')
  async searchProductName(@Param('name') name: string,
  ) {
    try {
      return this.productService.findByName(name,
        // author, category
      )

    } catch (error) {
      console.log(error);
    }
  }
  // Thêm sản phẩm

}



