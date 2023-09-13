import axiosClient from '../api/axiosClient';
import { IBook, IEditBook } from '../types/typeBook';

export class BookAPI {
  static async getAllBook(): Promise<Array<IBook>> {
    const url: string = "api/v1/product/getBook";
    return axiosClient.get(url);
  }
  static async deleteId(id: number) {
    const url: string = `api/v1/product/${id}`;
    return axiosClient.delete(url);
  }
  static async searchBook(searchTerm: string) {
    const url: string = `api/v1/product/search/${searchTerm}`;
    return axiosClient.get(url);
  }
  static async getBookById(id: number) {
    const url: string = `api/v1/product/getBook/${id}`;
    return axiosClient.get(url);
  }
  static async updateBook(id: number, data: IEditBook): Promise<void> {
    const url = `api/v1/product/${id}`;
    return axiosClient.patch(url, data);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async postBook(data: any): Promise<Array<IEditBook>> {
    const url: string = "api/v1/product";
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
  }
  static async getOder() {
    const url = "api/v1/history";
    return axiosClient.get(url);
  }
}